using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels.Interfaces;
using Tournament.API.Common.Enums;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Facades
{
    public class FacadeBaseWithMedia<TDetailModel, TListModel, TFormModel, TFormDefaultModel, TEntity> : FacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel, TEntity>
        where TDetailModel : class, IDetailModel
        where TListModel : class, IListModel
        where TFormModel : class, IFormModel
        where TFormDefaultModel : class, IFormDefaultModel, new ()
        where TEntity : class, IEntity
    {
        protected readonly IWebHostEnvironment WebHostEnvironment;
        public FacadeBaseWithMedia(IUnitOfWork unitOfWork, IMapper mapper, Entities entity, IWebHostEnvironment webHostEnvironment) : base(unitOfWork, mapper, entity)
        {
            WebHostEnvironment = webHostEnvironment;
        }

        protected bool IsImage(IFormFile file)
        {
            ///@cite https://stackoverflow.com/questions/11063900/determine-if-uploaded-file-is-image-any-format-on-mvc
            //-------------------------------------------
            //  Check the image mime types
            //-------------------------------------------

            var regex = new Regex(@"^image/");
            if( regex.Matches(file?.ContentType).Count == 0)
            {
                return false;
            }
            /*
            if (!string.Equals(file?.ContentType, "image/jpg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/jpeg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/pjpeg", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/gif", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/x-png", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/png", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(file?.ContentType, "image/webp", StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }
            */

            //-------------------------------------------
            //  Check the image extension
            //-------------------------------------------
            var postedFileExtension = Path.GetExtension(file.FileName);
            if (!string.Equals(postedFileExtension, ".jpg", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(postedFileExtension, ".png", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(postedFileExtension, ".gif", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(postedFileExtension, ".jpeg", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(postedFileExtension, ".webp", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            return true;
        }

        protected (string, string) GeneratePathForUploadingImages(string wwwrootPath)
        {
            var currentDate = DateTime.UtcNow;
            var shortPath = Path.Combine("Uploads", currentDate.Year.ToString(), currentDate.Month.ToString());
            var uploads = Path.Combine(wwwrootPath, shortPath);
            if (!Directory.Exists(uploads))
                Directory.CreateDirectory(uploads);

            return (uploads, shortPath);
        }

        protected void UploadMedia(TFormModel formModel, string wwwrootPath)
        {
            if (formModel is not IImage formModelWithImage) { return; }
            if(formModelWithImage.Image == null) { return; }
            var (uploads, shortPath) = GeneratePathForUploadingImages(wwwrootPath);

            var imageName = Guid.NewGuid().ToString() + ".png"; //seed image name

            var filePath = Path.Combine("/", shortPath, imageName); //path to db 
            var filePathAbsolute = Path.Combine(uploads, imageName); //path to save on disk

            using var fileStream = new FileStream(filePathAbsolute, FileMode.Create);
            
            //Accept files less than 10 MiB
            if (formModelWithImage.Image == null) { return; }
            if (formModelWithImage.Image.Length > 10485760) { return; }
            //Accept only images
            if (!IsImage(formModelWithImage.Image)) { return; }

            formModelWithImage.Image.CopyTo(fileStream);


            formModelWithImage.ImagePath = filePath;
        }

        protected void DeleteMedia(TDetailModel formModel)
        {
            if (formModel is not IImagePath formModelWithImage) { return; }
            if(formModelWithImage.ImagePath == null) { return; }
            var imagePath = formModelWithImage.ImagePath;
            imagePath = imagePath.Replace("/", "\\");

            var filePathAbsolute = WebHostEnvironment.WebRootPath + imagePath;


            if (File.Exists(filePathAbsolute))
            {
                File.Delete(filePathAbsolute);
            }
        }

        public override TListModel Add(TFormModel formModel)
        {
            UploadMedia(formModel, WebHostEnvironment.WebRootPath);
            return base.Add(formModel);
        }

        public override TListModel Update(TFormModel formModel)
        {
            DeleteMedia(Mapper.Map<TDetailModel>(formModel));
            if (formModel is IImagePath formModelWithImage)
            {
                formModelWithImage.ImagePath = null;
            }

            UploadMedia(formModel, WebHostEnvironment.WebRootPath);
            return base.Update(formModel);
        }

        public override void Remove(Guid id)
        {
            var detailModel = GetById(id);
            if (detailModel == null) { return; }
            DeleteMedia(detailModel);
            base.Remove(id);
        }
    }
}

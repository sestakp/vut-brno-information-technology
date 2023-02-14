using Microsoft.AspNetCore.Http;

namespace Tournament.API.Common.Interfaces
{
    public interface IImage : IImagePath
    {
        IFormFile? Image { get; set; }
    }
}

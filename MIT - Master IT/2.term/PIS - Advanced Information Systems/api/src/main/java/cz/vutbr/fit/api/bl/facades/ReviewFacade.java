package cz.vutbr.fit.api.bl.facades;


import cz.vutbr.fit.api.bl.mappers.ReviewMapper;
import cz.vutbr.fit.api.bl.mappers.RoomMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.formModels.ReviewFormModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.repositories.ReviewRepository;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.EntityPart;

import java.util.List;

@RequestScoped
public class ReviewFacade extends FacadeBase<ReviewEntity> {

    private UnitOfWork unitOfWork;
    private ReviewMapper mapper;

    @Inject
    ReviewFacade(UnitOfWork unitOfWork, ReviewMapper mapper)
    {

        super(unitOfWork.getReviewRepository(), mapper, unitOfWork);
        this.unitOfWork = unitOfWork;
        this.mapper = mapper;
    }

    ReviewFacade()
    {

    }


    public long Create(List<EntityPart> formData) throws Exception
    {

        ReviewFormModel formModel = (ReviewFormModel)mapper.MapFormDataToFormModel(formData);

        UserEntity user = _unitOfWork.getUserRepository().getById(formModel.getUserId());

        if(user == null){
            return -1;
        }

        IEntity entity = mapper.MapFormModelToEntity(formModel,  user);

        //user.setReview((ReviewEntity)entity);

        return super.Create(entity);
    }

    public IDetailModel getByUserId(long userId){
        var review = unitOfWork.getReviewRepository().getByUserId(userId);
        if(review == null){
            return null;
        }
        return mapper.MapEntityToDetail(review);
    }


}

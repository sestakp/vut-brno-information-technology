package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.ReviewDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.RoomDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.ReviewEndModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReviewFormModel;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.listModels.ReviewListModel;
import cz.vutbr.fit.api.bl.models.listModels.RoomListModel;
import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.repositories.RepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ReviewMapper extends MapperBase<ReviewEntity, ReviewFormModel, ReviewDetailModel, ReviewListModel, ReviewEndModel> {


    private UserMapper userMapper = new UserMapper();


    public ReviewMapper()
    {
        super(ReviewEntity.class, ReviewFormModel.class, ReviewDetailModel.class, ReviewListModel.class, ReviewEndModel.class);
    }



    public IEntity MapFormModelToEntity(IFormModel _model, UserEntity user)
    {
        ReviewEntity entity = new ReviewEntity();
        ReviewFormModel model = (ReviewFormModel)_model;

        entity.setId(model.getId());
        entity.setRating(model.getRating());
        entity.setText(model.getText());
        
        entity.setUser(user);

        return entity;
    }
}

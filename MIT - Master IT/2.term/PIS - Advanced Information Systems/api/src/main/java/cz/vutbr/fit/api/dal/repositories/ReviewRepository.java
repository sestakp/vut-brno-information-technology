package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.util.List;

@RequestScoped
public class ReviewRepository  extends RepositoryBase<ReviewEntity>{
    private EntityManager _entityManager;

    @Inject
    ReviewRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "Review", ReviewEntity.class, entityFactory);
        this._entityManager = entityManager;

    }

    ReviewRepository(){

    }

    public IEntity getByUserId(long userId){
        List<IEntity> resultList = _entityManager.createNamedQuery("Review.getByUserId").setParameter("userId", userId).getResultList();

        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    @Override
    public long Insert(ReviewEntity entity){
        var userId = entity.getUser().getId();


        var userReview = (ReviewEntity) getByUserId(userId);
        if(userReview == null){
            return super.Insert(entity);
        }
        else{
            userReview.setText(entity.getText());
            userReview.setRating(entity.getRating());
            return super.Update(userReview);
        }
    }

}

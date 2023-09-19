package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.bl.models.others.MealModel;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class ReservationRepository extends RepositoryBase<ReservationEntity>{

    private EntityManager _entityManager;

    @Inject
    ReservationRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "Reservation", ReservationEntity.class, entityFactory);
        this._entityManager = entityManager;

    }

    ReservationRepository()
    {

    }

    public List<IEntity> getReservationsByUserId(long userId){
        return _entityManager.createNamedQuery("Reservation.getByUserId").setParameter("id", userId).getResultList();
    }

}

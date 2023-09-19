package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@RequestScoped
public class RoomRepository extends RepositoryBase<RoomEntity>{

    private  EntityManager _entityManager;

    @Inject
    RoomRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "Room", RoomEntity.class, entityFactory);
        this._entityManager = entityManager;

    }

    RoomRepository()
    {

    }

    public List<IEntity> getAvailableRooms(LocalDate start, LocalDate end){
        return _entityManager.createNamedQuery("Room.getAllAvailable")
                .setParameter("startDate", start)
                .setParameter("endDate", end)
                .getResultList();
    }




}

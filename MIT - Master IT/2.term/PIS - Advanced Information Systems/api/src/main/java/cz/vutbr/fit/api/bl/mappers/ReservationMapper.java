package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.models.detailModels.ReservationDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.ReservationEndModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReservationFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReviewFormModel;
import cz.vutbr.fit.api.bl.models.listModels.ReservationListModel;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;

import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ReservationMapper extends MapperBase<ReservationEntity, ReservationFormModel,
        ReservationDetailModel, ReservationListModel, ReservationEndModel>{

    public ReservationMapper(){
        super(ReservationEntity.class, ReservationFormModel.class, ReservationDetailModel.class, ReservationListModel.class
                , ReservationEndModel.class);
    }


    public IEntity MapFormModelToEntity(IFormModel _model, UserEntity user, List<RoomEntity> rooms)
    {
        ReservationEntity entity = modelMapper.map(_model, _entityType);
        entity.setUser(user);
        entity.setRooms(rooms);

        return entity;
    }

}

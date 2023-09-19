package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.models.detailModels.NoteDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.NoteEndModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.NoteFormModel;
import cz.vutbr.fit.api.bl.models.listModels.NoteListModel;
import cz.vutbr.fit.api.dal.entity.NoteEntity;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class NoteMapper extends MapperBase<NoteEntity, NoteFormModel, NoteDetailModel, NoteListModel, NoteEndModel> {
    public NoteMapper(){
        super(NoteEntity.class, NoteFormModel.class, NoteDetailModel.class, NoteListModel.class
                , NoteEndModel.class);
    }


    public IEntity MapFormModelToEntity(IFormModel _model, RoomEntity room, ReservationEntity reservation)
    {
        NoteEntity entity = modelMapper.map(_model, _entityType);
        entity.setRoom(room);
        entity.setReservation(reservation);

        return entity;
    }
}

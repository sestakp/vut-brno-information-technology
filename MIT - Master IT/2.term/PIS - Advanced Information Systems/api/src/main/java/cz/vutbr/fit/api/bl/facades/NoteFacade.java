package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.LocalIdentityStore;
import cz.vutbr.fit.api.bl.mappers.EmployeeMapper;
import cz.vutbr.fit.api.bl.mappers.NoteMapper;
import cz.vutbr.fit.api.bl.models.formModels.NoteFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReservationFormModel;
import cz.vutbr.fit.api.dal.entity.*;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.EntityPart;

import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class NoteFacade extends FacadeBase<NoteEntity>{

    private UnitOfWork _unitOfWork;
    private NoteMapper _mapper;



    @Inject
    NoteFacade(UnitOfWork unitOfWork, NoteMapper mapper) {
        super(unitOfWork.getNoteRepository(), mapper, unitOfWork);
        this._unitOfWork = unitOfWork;
        this._mapper = mapper;
    }

    NoteFacade()
    {
    }

    public long Create(List<EntityPart> formData) throws Exception
    {
        NoteFormModel formModel = (NoteFormModel) _mapper.MapFormDataToFormModel(formData);

        RoomEntity room = _unitOfWork.getRoomRepository().getById(formModel.getRoomId());
        ReservationEntity reservation = _unitOfWork.getReservationRepository().getById(formModel.getReservationId());

        IEntity entity = _mapper.MapFormModelToEntity(formModel, room, reservation);


        RoomEntity roomEntity = (RoomEntity)_unitOfWork.getRoomRepository().getById(formModel.getRoomId());
        List<NoteEntity> notes = roomEntity.getNotes();
        notes.add((NoteEntity)entity);
        roomEntity.setNotes(notes);

        ReservationEntity reservationEntity = (ReservationEntity)_unitOfWork.getReservationRepository().getById(formModel.getReservationId());
        List<NoteEntity> notes2 = reservationEntity.getNotes();
        notes2.add((NoteEntity)entity);
        reservationEntity.setNotes(notes2);


        return super.Create(entity);
    }



}
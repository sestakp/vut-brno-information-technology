package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.bl.mappers.RoomMapper;
import cz.vutbr.fit.api.bl.models.detailModels.RoomDetailModel;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.listModels.RoomListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.EntityPart;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RequestScoped
public class RoomFacade extends FacadeBase{

    private UnitOfWork _unitOfWork;
    private RoomMapper _mapper;

    @Inject
    RoomFacade(UnitOfWork unitOfWork, RoomMapper mapper)
    {

        super(unitOfWork.getRoomRepository(), mapper, unitOfWork);
        this._unitOfWork = unitOfWork;
        this._mapper = mapper;
    }
   RoomFacade()
   {

   }

    public List<IListModel> getAvailableRooms(String start, String end){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(start,formatter);
        LocalDate endDate = LocalDate.parse(end,formatter);

        return _mapper.MapEntitiesToList(_unitOfWork.getRoomRepository().getAvailableRooms(startDate, endDate));
    }

}

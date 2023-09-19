package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.LocalIdentityStore;
import cz.vutbr.fit.api.bl.mappers.ReservationMapper;
import cz.vutbr.fit.api.bl.mappers.RoomMapper;
import cz.vutbr.fit.api.bl.models.formModels.ReservationFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReviewFormModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.listModels.ReservationListModel;
import cz.vutbr.fit.api.bl.models.others.MealModel;
import cz.vutbr.fit.api.bl.models.others.ParkingInfo;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.EntityPart;
import org.hsqldb.rights.User;
import jakarta.security.enterprise.SecurityContext;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class ReservationFacade extends FacadeBase<ReservationEntity>{

    private UnitOfWork _unitOfWork;
    private ReservationMapper _mapper;

    @Inject
    ReservationFacade(UnitOfWork unitOfWork, ReservationMapper mapper)
    {

        super(unitOfWork.getReservationRepository(), mapper, unitOfWork);
        this._unitOfWork = unitOfWork;
        this._mapper = mapper;
    }
    ReservationFacade()
    {

    }

    public long Create(List<EntityPart> formData) throws Exception
    {
        ReservationFormModel formModel = (ReservationFormModel)_mapper.MapFormDataToFormModel(formData);

        List<RoomEntity> rooms = new ArrayList<>();


        for (var r : formModel.getRooms())
            rooms.add(_unitOfWork.getRoomRepository().getById(Long.parseLong(r)));


        UserEntity user = _unitOfWork.getUserRepository().getById(formModel.getUserId());

        IEntity entity = _mapper.MapFormModelToEntity(formModel,  user, rooms);

        List<ReservationEntity> list = user.getReservations();
        list.add((ReservationEntity) entity);
        user.setReservations(list);

        for (var r : rooms)
        {
            List<ReservationEntity> reservations = r.getReservations();
            reservations.add((ReservationEntity)entity);
            r.setReservations(reservations);
        }

        return super.Create(entity);
    }

    public List<IListModel> getReservationsByUserId(long userId){
        return _mapper.MapEntitiesToList(_unitOfWork.getReservationRepository().getReservationsByUserId(userId));
    }

    public List<MealModel> getMealInfo(){

        List<MealModel> list = new ArrayList<>();
        List<ReservationEntity> reservations =  _unitOfWork.getReservationRepository().getAll();
        LocalDate today = LocalDate.now();
        for (int i=0;i<3;i++)
        {
         
            MealModel model = new MealModel();
            model.date = today;
            for (ReservationEntity res : reservations)
            {
                if (     (today.isAfter(res.getStartDate()) && today.isBefore(res.getEndDate())) || today.isEqual(res.getStartDate())
                    || today.isEqual(res.getEndDate()))
                {
                    model.normal += res.getNormalBreakfast();
                    model.vegan += res.getVeganBreakfast();
                    model.vegetarian += res.getVegetarianBreakfast();
                    for (RoomEntity r : res.getRooms())
                    {
                        model.adults += r.getNumberOfAdults();
                        model.children += r.getNumberOfChilds();
                    }

                }
            }
            list.add(model);
            today = today.plusDays(1);

        }

        return list;
    }


    public ParkingInfo getTakenParkingSlots(String start, String end)
    {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(start,formatter);
        LocalDate endDate = LocalDate.parse(end,formatter);

        List<ReservationEntity> list = _repository.getAll();
        ParkingInfo info = new ParkingInfo();


        for (ReservationEntity res : list)
        {
            if (res.getStartDate()==null || res.getEndDate()==null)
                continue;

            LocalDate resStartDate = res.getStartDate();
            LocalDate resEndDate = res.getEndDate();

            if (startDate.isAfter(resEndDate))
                continue;
            if (endDate.isBefore(resStartDate))
                continue;

            info.setVipParking(info.getVipParking() + res.getVipParking());
            info.setInsideParking(info.getInsideParking() + res.getInsideParking());
            info.setOutsideParking(info.getOutsideParking() + res.getOutsideParking());
        }

        return info;
    }


    public void removeById(long id, String email)
    {


        _unitOfWork.beginTransaction();

        List<UserEntity> users = _unitOfWork.getUserRepository().getAll();
        List<RoomEntity> rooms = _unitOfWork.getRoomRepository().getAll();
        ReservationEntity reservation = _unitOfWork.getReservationRepository().getById(id);

        if( ! reservation.getUser().getEmail().equals(email)){
            return;
        }

        for (UserEntity user : users)
        {
            if (user.getReservations().contains(reservation))
            {
                List<ReservationEntity> list = user.getReservations();
                list.remove(reservation);
                user.setReservations(list);
            }
        }

        for (RoomEntity room : rooms)
        {
            if (room.getReservations().contains(reservation))
            {
                List<ReservationEntity> list = room.getReservations();
                list.remove(reservation);
                room.setReservations(list);
            }
        }


        _repository.removeById(id);
        _unitOfWork.commit();
    }


}

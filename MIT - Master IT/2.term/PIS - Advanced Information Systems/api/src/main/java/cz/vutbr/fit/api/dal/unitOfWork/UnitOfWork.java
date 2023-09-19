package cz.vutbr.fit.api.dal.unitOfWork;

import cz.vutbr.fit.api.dal.entity.*;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.repositories.*;
import cz.vutbr.fit.api.dal.repositories.interfaces.IRepository;
import cz.vutbr.fit.api.dal.repositories.interfaces.IRoomRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Dependent;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@RequestScoped
public class UnitOfWork {


    UnitOfWork()
    {

    }

    private RoomRepository roomRepository;

    public RoomRepository getRoomRepository() {
        return roomRepository;
    }

    private UserRepository userRepository;
    public UserRepository getUserRepository() { return userRepository; }

    private ReviewRepository reviewRepository;

    public ReviewRepository getReviewRepository() {return reviewRepository;}


    private ReservationRepository reservationRepository;

    public ReservationRepository getReservationRepository() {
        return reservationRepository;
    }

    private EmployeeRepository employeeRepository;

    public EmployeeRepository getEmployeeRepository() {
        return employeeRepository;
    }

    private NoteRepository noteRepository;
    public NoteRepository getNoteRepository() { return noteRepository; }

    public RepositoryBase getRepository(Class cls)
   {
       if (cls.equals(UserEntity.class))
           return  userRepository;
       else if (cls.equals(RoomEntity.class))
           return roomRepository;
       else if (cls.equals(ReviewEntity.class))
           return reviewRepository;
       else if (cls.equals(ReservationEntity.class))
           return reservationRepository;
       else if (cls.equals(EmployeeEntity.class))
           return employeeRepository;
       else if (cls.equals(NoteEntity.class))
           return noteRepository;

       return null;
   }

    @Inject
    UnitOfWork(RoomRepository roomRepo, UserRepository userRepo,  ReviewRepository revr, ReservationRepository reser, EmployeeRepository employeeRepository, NoteRepository noteRepository)
    {
        roomRepository = roomRepo;
        userRepository = userRepo;
        reservationRepository = reser;
        reviewRepository = revr;
        this.employeeRepository = employeeRepository;
        this.noteRepository = noteRepository;
        //repository = base;
    }

    @Inject
    private EntityManager _entityManager;

    public void beginTransaction(){
        _entityManager.getTransaction().begin();
    }

    public void commit()
    {
        _entityManager.getTransaction().commit();
    }

}

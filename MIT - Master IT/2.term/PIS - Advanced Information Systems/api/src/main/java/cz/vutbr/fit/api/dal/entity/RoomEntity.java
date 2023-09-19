package cz.vutbr.fit.api.dal.entity;


import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@NamedQuery(name = "Room.getAll", query = "SELECT r FROM RoomEntity r")
@NamedQuery(name = "Room.getById", query = "SELECT r FROM RoomEntity r WHERE r.id = :id")
@NamedQuery(name = "Room.removeAll", query = "DELETE FROM RoomEntity")



//@NamedQuery(name = "Room.getAllAvailable", query = "SELECT r FROM RoomEntity r")

@NamedQuery(
        name = "Room.getAllAvailable",
        query = "SELECT r FROM RoomEntity r\n" +
                "WHERE NOT EXISTS (\n" +
                "    SELECT 1 FROM ReservationEntity res\n" +
                "    JOIN res.rooms room\n" +
                "    WHERE room = r AND (res.startDate <= :endDate AND res.endDate >= :startDate)\n" +
                ")\n"
)



//@NamedQuery(name = "Room.getAllAvailable", query = ("SELECT r FROM RoomEntity r WHERE r NOT IN (" +
//                "SELECT res.rooms FROM ReservationEntity res " +
//                "WHERE (:endDate <= res.startDate OR :startDate >= res.endDate))"))

//@NamedQuery(name = "Room.getAllAvailable", query = "SELECT r FROM RoomEntity r WHERE r NOT IN (" +
//        "SELECT rr.room FROM ReservationRoomRelationshipEntity rr " +
//        "WHERE (:endDate <= rr.reservation.startDate OR :startDate >= rr.reservation.endDate))")
public class RoomEntity implements IEntity {
    @Id
    @GeneratedValue
    private long id;
    @NotNull
    private String title;
    @Column(length = 1_000)
    private String description;

    @NotNull
    private long price;

    @ElementCollection
    @CollectionTable(name = "room_services", joinColumns = @JoinColumn(name = "room_id"))
    private List<String> services = new ArrayList<>();

    @Column(length = 15_000_000)
    private String img;
    private int numberOfAdults;
    private int numberOfChilds;

    @ManyToMany(mappedBy="rooms"/*cascade = { CascadeType.PERSIST, CascadeType.MERGE }*/)
    /*@JoinTable(name = "reservation_room",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "reservation_id"))*/
    List<ReservationEntity> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "room", cascade = { CascadeType.REMOVE }, orphanRemoval = true)
    private List<NoteEntity> notes = new ArrayList<>();

    public List<ReservationEntity> getReservations() {
        return reservations;
    }


    public List<NoteEntity> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEntity> notes) {
        this.notes = notes;
    }

    public void setReservations(List<ReservationEntity> reservations) {
        this.reservations = reservations;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @Override
    public String toString() {
        return "RoomEntity{" +
                "id=" + id +
                ", price=" + price +
                ", description='" + description + '\'' +
                '}';
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public int getNumberOfChilds() {
        return numberOfChilds;
    }

    public void setNumberOfChilds(int numberOfChilds) {
        this.numberOfChilds = numberOfChilds;
    }

    public int getNumberOfAdults() {
        return numberOfAdults;
    }

    public void setNumberOfAdults(int numberOfAdults) {
        this.numberOfAdults = numberOfAdults;
    }
}

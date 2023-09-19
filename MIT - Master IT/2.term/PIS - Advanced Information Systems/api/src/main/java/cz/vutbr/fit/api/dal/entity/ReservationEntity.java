package cz.vutbr.fit.api.dal.entity;

import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.eclipse.persistence.jpa.config.Cascade;
import org.hsqldb.rights.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@NamedQuery(name = "Reservation.getAll", query = "SELECT r FROM ReservationEntity r")
@NamedQuery(name = "Reservation.getById", query = "SELECT r FROM ReservationEntity r WHERE r.id = :id")
@NamedQuery(name = "Reservation.removeAll", query = "DELETE FROM ReservationEntity ")
@NamedQuery(name = "Reservation.getByUserId", query = "SELECT r FROM ReservationEntity r WHERE r.user.id = :id")

public class ReservationEntity implements IEntity {

    @Id
    @GeneratedValue
    private long id;

    @Column(length = 3000)
    String cookNotes;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    private UserEntity user;

    @NotNull
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="reservation_rooms")
    private List<RoomEntity> rooms = new ArrayList<>();

    @OneToMany//(mappedBy = "reservation",cascade = { CascadeType.REMOVE }, orphanRemoval = true)
    private List<NoteEntity> notes = new ArrayList<>();

    private int vipParking;

    private int outsideParking;

    private int insideParking;

    private int normalBreakfast;

    private int vegetarianBreakfast;

    private int veganBreakfast;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
    private Boolean paid;

    public Boolean getPaid(){
        return this.paid;
    }

    public void setPaid(Boolean paid){
        this.paid = paid;
    }
    public List<NoteEntity> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEntity> notes) {
        this.notes = notes;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    @Override
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCookNotes() {
        return cookNotes;
    }

    public void setCookNotes(String cookNotes) {
        this.cookNotes = cookNotes;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<RoomEntity> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomEntity> rooms) {
        this.rooms = rooms;
    }

    public int getVipParking() {
        return vipParking;
    }

    public void setVipParking(int vipParking) {
        this.vipParking = vipParking;
    }

    public int getOutsideParking() {
        return outsideParking;
    }

    public void setOutsideParking(int outsideParking) {
        this.outsideParking = outsideParking;
    }

    public int getInsideParking() {
        return insideParking;
    }

    public void setInsideParking(int insideParking) {
        this.insideParking = insideParking;
    }

    public int getNormalBreakfast() {
        return normalBreakfast;
    }

    public void setNormalBreakfast(int normalBreakfast) {
        this.normalBreakfast = normalBreakfast;
    }

    public int getVegetarianBreakfast() {
        return vegetarianBreakfast;
    }

    public void setVegetarianBreakfast(int vegetarianBreakfast) {
        this.vegetarianBreakfast = vegetarianBreakfast;
    }

    public int getVeganBreakfast() {
        return veganBreakfast;
    }

    public void setVeganBreakfast(int veganBreakfast) {
        this.veganBreakfast = veganBreakfast;
    }
}

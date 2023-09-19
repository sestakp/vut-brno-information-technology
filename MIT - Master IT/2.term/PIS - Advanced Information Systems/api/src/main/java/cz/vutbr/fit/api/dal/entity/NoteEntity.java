package cz.vutbr.fit.api.dal.entity;

import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@NamedQuery(name = "Note.getAll", query = "SELECT n FROM NoteEntity n")
@NamedQuery(name = "Note.getById", query = "SELECT n FROM NoteEntity n WHERE n.id = :id")
@NamedQuery(name = "Note.removeAll", query = "DELETE FROM NoteEntity")
public class NoteEntity implements IEntity {
    @Id
    @GeneratedValue
    private long id;

    @NotNull
    private String text;
    private String state;

    @ManyToOne//(fetch = FetchType.LAZY)//(cascade = { CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private ReservationEntity reservation;

    @ManyToOne//(fetch = FetchType.LAZY)//(cascade = { CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private RoomEntity room;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    public ReservationEntity getReservation() {
        return reservation;
    }

    public void setReservation(ReservationEntity reservation) {
        this.reservation = reservation;
    }

    public RoomEntity getRoom() {
        return room;
    }

    public void setRoom(RoomEntity room) {
        this.room = room;
    }
}

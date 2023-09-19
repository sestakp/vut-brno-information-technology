package cz.vutbr.fit.api.bl.models.listModels;

import cz.vutbr.fit.api.bl.models.endModels.ReservationEndModel;
import cz.vutbr.fit.api.bl.models.endModels.RoomEndModel;
import cz.vutbr.fit.api.bl.models.endModels.UserEndModel;

public class NoteListModel implements IListModel {
    private long id;
    private String text;
    private String state;

    private RoomEndModel room;

    private ReservationEndModel reservation;


    public RoomEndModel getRoom() {
        return room;
    }

    public void setRoom(RoomEndModel room) {
        this.room = room;
    }

    public ReservationEndModel getReservation() {
        return reservation;
    }

    public void setReservation(ReservationEndModel reservation) {
        this.reservation = reservation;
    }

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
}

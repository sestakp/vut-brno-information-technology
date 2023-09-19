package cz.vutbr.fit.api.bl.models.formModels;

public class NoteFormModel implements IFormModel{
    private long id;
    private String text;
    private String state;


    private long reservationId;

    private long roomId;


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

    public long getReservationId() {
        return reservationId;
    }

    public void setReservationId(long reservationId) { this.reservationId = reservationId; }

    public long getRoomId() {
        return roomId;
    }

    public void setRoomId(long roomId) { this.roomId = roomId; }
}

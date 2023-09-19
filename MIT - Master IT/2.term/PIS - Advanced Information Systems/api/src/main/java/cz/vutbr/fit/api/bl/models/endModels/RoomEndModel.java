package cz.vutbr.fit.api.bl.models.endModels;

import java.util.ArrayList;
import java.util.List;

public class RoomEndModel implements IEndModel{

    private long id;
    private String title;

    private String description;
    private long price;

    private List<NoteEndModel> notes;

    private List<String> services = new ArrayList<>();

    private String img;
    private int numberOfAdults;
    private int numberOfChilds;

    public List<NoteEndModel> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteEndModel> notes) {
        this.notes = notes;
    }
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public int getNumberOfAdults() {
        return numberOfAdults;
    }

    public void setNumberOfAdults(int numberOfAdults) {
        this.numberOfAdults = numberOfAdults;
    }

    public int getNumberOfChilds() {
        return numberOfChilds;
    }

    public void setNumberOfChilds(int numberOfChilds) {
        this.numberOfChilds = numberOfChilds;
    }
}



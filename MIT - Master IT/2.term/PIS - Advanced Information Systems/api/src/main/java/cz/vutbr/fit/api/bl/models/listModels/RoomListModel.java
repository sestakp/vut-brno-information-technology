package cz.vutbr.fit.api.bl.models.listModels;

import cz.vutbr.fit.api.bl.models.endModels.NoteEndModel;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

public class RoomListModel implements IListModel{

    private long id;
    private String title;
    private long price;
    private String description;
    private List<String>services;
    private String img;
    private int numberOfAdults;
    private int numberOfChilds;


    private List<NoteEndModel> notes;

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


    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

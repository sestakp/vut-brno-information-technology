package cz.vutbr.fit.api.bl.models.formModels;

import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReservationFormModel implements IFormModel{

    private long id;


    String cookNotes;


    private int userId;


    //Neptej se..
    private List<String> rooms = new ArrayList<>();

    private int vipParking;

    private int outsideParking;

    private int insideParking;

    private int normalBreakfast;

    private int vegetarianBreakfast;

    private int veganBreakfast;

    private LocalDate startDate;

    private LocalDate endDate;
    private Boolean paid;

    public List<String> getRooms() {
        return rooms;
    }

    public void setRooms(List<String> rooms) {
        this.rooms = rooms;
    }

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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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
}




package cz.vutbr.fit.api.bl.models.detailModels;

import cz.vutbr.fit.api.bl.models.endModels.ReservationEndModel;
import cz.vutbr.fit.api.bl.models.endModels.ReviewEndModel;
import cz.vutbr.fit.api.bl.models.listModels.ReviewListModel;
import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.json.bind.annotation.JsonbVisibility;
import jakarta.json.bind.config.PropertyVisibilityStrategy;
import jakarta.persistence.Column;

import java.util.ArrayList;
import java.util.List;


public class UserDetailModel implements IDetailModel {


    private long id;

    private String name;

    private String email;

    private String tel;


    private String avatar;


    private String role;


    private List<ReservationEndModel> reservations = new ArrayList<>();

    private ReviewEndModel review;


    public List<ReservationEndModel> getReservations() {
        return reservations;
    }

    public void setReservations(List<ReservationEndModel> reservations) {
        this.reservations = reservations;
    }

    public ReviewEndModel getReview() {
        return review;
    }

    public void setReview(ReviewEndModel review) {
        this.review = review;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

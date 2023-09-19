package cz.vutbr.fit.api.bl.models.detailModels;

import cz.vutbr.fit.api.bl.models.endModels.UserEndModel;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.json.bind.annotation.JsonbVisibility;
import jakarta.json.bind.config.PropertyVisibilityStrategy;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;



public class ReviewDetailModel implements IDetailModel{


    private long id;

    private String text;


    private UserEndModel user;

    private int rating;


    public UserEndModel getUser() {
        return user;
    }

    public void setUser(UserEndModel user) {
        this.user = user;
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





    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}

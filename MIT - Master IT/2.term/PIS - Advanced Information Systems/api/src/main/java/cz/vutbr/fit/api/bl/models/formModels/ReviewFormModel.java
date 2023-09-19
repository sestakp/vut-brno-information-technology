package cz.vutbr.fit.api.bl.models.formModels;

import cz.vutbr.fit.api.dal.entity.UserEntity;

public class ReviewFormModel implements IFormModel{


    private String text;
    private int rating;
    private long userId;

    private long id;


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

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}

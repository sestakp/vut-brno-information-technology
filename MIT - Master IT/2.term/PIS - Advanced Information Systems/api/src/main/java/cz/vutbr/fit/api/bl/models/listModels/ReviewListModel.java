package cz.vutbr.fit.api.bl.models.listModels;

import cz.vutbr.fit.api.bl.models.endModels.UserEndModel;
import cz.vutbr.fit.api.dal.entity.UserEntity;

public class ReviewListModel implements IListModel{
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

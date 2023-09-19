package cz.vutbr.fit.api.bl.models.endModels;

import cz.vutbr.fit.api.bl.models.detailModels.UserDetailModel;

public class ReviewEndModel implements IEndModel{


    private long id;

    private String text;

    private int rating;


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

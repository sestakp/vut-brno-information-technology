package cz.vutbr.fit.api.bl.models.listModels;

import cz.vutbr.fit.api.bl.models.endModels.ReviewEndModel;

public class UserListModel implements IListModel{



    private long id;

    private String name;

    private String email;

    private ReviewEndModel review;

    private String avatar;

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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}

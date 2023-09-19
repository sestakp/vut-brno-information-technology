package cz.vutbr.fit.api.dal.entity;

import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@NamedQuery(name = "User.getAll", query = "SELECT u FROM UserEntity u")
@NamedQuery(name = "User.getById", query = "SELECT u FROM UserEntity u WHERE u.id = :id")
@NamedQuery(name = "User.getByEmail", query = "SELECT u FROM UserEntity u WHERE u.email = :email")
@NamedQuery(name = "User.removeAll", query = "DELETE FROM UserEntity")
public class UserEntity implements IEntity {

    @Id
    @GeneratedValue
    private long id;

    @NotNull
    private String name;

    @NotNull
    private String email;

    private String tel;
    @Column(length = 1_000)
    private String passwordHash;

    @Column(length = 20_000_000)
    private String avatar;

    @OneToOne(cascade = { CascadeType.ALL })
    private ReviewEntity review;

    @OneToMany(cascade = { CascadeType.ALL })
    private List<ReservationEntity> reservations = new ArrayList<>();

    //private String role;


    public List<ReservationEntity> getReservations() {
        return reservations;
    }

    public void setReservations(List<ReservationEntity> reservations) {
        this.reservations = reservations;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }


    public ReviewEntity getReview() {
        return review;
    }

    public void setReview(ReviewEntity review) {
        this.review = review;
    }

    /*public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }*/
    @Override
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }


}

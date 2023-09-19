package cz.vutbr.fit.api.dal.entity;

import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@NamedQuery(name = "Review.getAll", query = "SELECT r FROM ReviewEntity r")
@NamedQuery(name = "Review.getById", query = "SELECT r FROM ReviewEntity r WHERE r.id = :id")
@NamedQuery(name = "Review.getByUserId", query = "SELECT r FROM ReviewEntity r WHERE r.user.id = :userId")
@NamedQuery(name = "Review.removeAll", query = "DELETE FROM ReviewEntity")
public class ReviewEntity implements IEntity {

   @Id
   @GeneratedValue
   private long id;

   @NotNull
   @Column(length = 3000)
   private String text;


   @OneToOne//(cascade = CascadeType.REMOVE)
   private UserEntity user;




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

   public UserEntity getUser() {
      return user;
   }

   public void setUser(UserEntity user) {
      this.user = user;
   }

   public int getRating() {
      return rating;
   }

   public void setRating(int rating) {
      this.rating = rating;
   }
}

package cz.vutbr.fit.api.dal.factories;

import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.inject.Singleton;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Random;

@Singleton
public class EntityFactory {


    public <TEntity extends IEntity> IEntity getEntity(Class<TEntity> cls){

        if(cls.equals(RoomEntity.class)) {
            return (TEntity) getRoomEntity();
        }
        else if(cls.equals(UserEntity.class)){
            return (TEntity) getUserEntity();
        }

        return null;
    }
    public RoomEntity getRoomEntity(){
        var randomNumber = new Random().nextInt() % 200;
        var entity = new RoomEntity();

        entity.setPrice(randomNumber);
        entity.setDescription(String.format("Room %d description", randomNumber));
        return entity;
    }


    public EmployeeEntity getUserEntity()
    {
        EmployeeEntity user = new EmployeeEntity();
        user.setEmail("test@test.cz");
        user.setRole("MANAGER");
        user.setPasswordHash(BCrypt.hashpw("123", BCrypt.gensalt()));

        return user;
    }

}

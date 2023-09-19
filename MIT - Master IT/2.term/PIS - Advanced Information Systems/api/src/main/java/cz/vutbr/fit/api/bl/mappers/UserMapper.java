package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.UserDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.UserEndModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.listModels.UserListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.common.enums.Roles;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.EntityPart;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import static cz.vutbr.fit.api.common.transformer.EntityPartTransformer.*;
import static cz.vutbr.fit.api.common.transformer.EntityPartTransformer.getString;

import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class UserMapper extends MapperBase<UserEntity, UserFormModel, UserDetailModel, UserListModel, UserEndModel>{

        public UserMapper(){
                super(UserEntity.class, UserFormModel.class, UserDetailModel.class, UserListModel.class, UserEndModel.class);
        }



        public UserEntity MapFormModelToEntity(UserFormModel formModel){
                var entity = new UserEntity();

                entity.setId(formModel.getId());
                entity.setAvatar(formModel.getAvatar());
                entity.setEmail(formModel.getEmail());
                entity.setTel(formModel.getTel());
                entity.setName(formModel.getName());
                entity.setPasswordHash(BCrypt.hashpw(formModel.getPassword(), BCrypt.gensalt()));
                //entity.setRole(Roles.CUSTOMER.getName());
                return entity;
        }
}

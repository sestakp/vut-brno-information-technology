package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.EmployeeDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.UserDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.EmployeeEndModel;
import cz.vutbr.fit.api.bl.models.endModels.UserEndModel;
import cz.vutbr.fit.api.bl.models.formModels.EmployeeFormModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.bl.models.listModels.EmployeeListModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.listModels.UserListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.common.enums.Roles;
import cz.vutbr.fit.api.dal.embedded.Address;
import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
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
public class EmployeeMapper extends MapperBase<EmployeeEntity, EmployeeFormModel, EmployeeDetailModel, EmployeeListModel, EmployeeEndModel>{

    public EmployeeMapper(){
        super(EmployeeEntity.class, EmployeeFormModel.class, EmployeeDetailModel.class, EmployeeListModel.class, EmployeeEndModel.class);
    }

    @Override
    public IListModel MapEntityToList(IEntity _entity){

        var listModel =  modelMapper.map(_entity, _listModelType);

        var address = ((EmployeeEntity) _entity).getAddress();
        listModel.setCity(address.getCity());
        listModel.setState(address.getState());
        listModel.setStreet(address.getStreet());
        listModel.setZipCode(address.getZipCode());
        return listModel;
    }

    public EmployeeEntity MapFormModelToEntity(EmployeeFormModel formModel) throws Exception{
        var entity = new EmployeeEntity();

        entity.setRole(formModel.getRole());
        entity.setName(formModel.getName());
        entity.setSurname(formModel.getSurname());
        entity.setEmail(formModel.getEmail());
        entity.setBankAccount(formModel.getBankAccount());
        Address address = new Address(formModel.getStreet(), formModel.getCity(),formModel.getState(), formModel.getZipCode());



        entity.setAddress(address);
        entity.setSalary(formModel.getSalary());

        entity.setPasswordHash(BCrypt.hashpw(formModel.getPassword(), BCrypt.gensalt()));

        return entity;
    }
}

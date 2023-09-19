package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.bl.mappers.UserMapper;
import cz.vutbr.fit.api.bl.models.detailModels.UserDetailModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.EntityPart;

import org.mindrot.jbcrypt.BCrypt;
import jakarta.security.enterprise.credential.UsernamePasswordCredential;

import java.util.List;

@RequestScoped
public class UserFacade extends FacadeBase<UserEntity>{

    private UnitOfWork _unitOfWork;
    private UserMapper _mapper;

    @Inject
    UserFacade(UnitOfWork unitOfWork, UserMapper mapper) {
        super(unitOfWork.getUserRepository(), mapper, unitOfWork);
        this._unitOfWork = unitOfWork;
        this._mapper = mapper;
    }

    UserFacade()
    {

    }


    public long Create(List<EntityPart> formData) throws Exception
    {
        //TODO... possible error, two mappers, one from entityParts and from form model.
        UserFormModel formModel = (UserFormModel)_mapper.MapFormDataToFormModel(formData);

        if (formModel.getPassword().length()<6)
        {
            throw new Exception("HESLO MUSI MIT ALESPON 6 ZNAKU!");
        }

        return super.Create(_mapper.MapFormModelToEntity(formModel));
    }

    
    public String getUserRole(String name){
        return "CUSTOMER";//((UserDetailModel) _mapper.MapEntityToDetail(_unitOfWork.getUserRepository().getUserByEmail(name))).getRole();
    }


    public long update(List<EntityPart> parts, String email) throws Exception
    {
    	
    	UserFormModel formModel = (UserFormModel)_mapper.MapFormDataToFormModel(parts);
    	UserEntity user = _unitOfWork.getUserRepository().getById(_mapper.MapFormModelToEntity(formModel).getId());

    	if(!user.getEmail().equals(email)){
            return -1;
        }

        return super.update(_mapper.MapFormModelToEntity(formModel));
    }
    
    public long updateField(List<EntityPart> parts, String email) throws Exception
    {
        var updateFieldModel = _mapper.mapFormToUpdateFieldModel(parts);
        UserEntity user = _unitOfWork.getUserRepository().getById(updateFieldModel.id);
        
        if(!user.getEmail().equals(email)){
        	throw new Exception("YOU CAN NOT CHANGE OTHER USERS!");
        }
        
        _unitOfWork.beginTransaction();
        var result = _repository.UpdateField(updateFieldModel);
        _unitOfWork.commit();
        return result;
    }

}
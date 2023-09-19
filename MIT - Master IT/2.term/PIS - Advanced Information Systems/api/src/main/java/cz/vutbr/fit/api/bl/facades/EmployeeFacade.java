package cz.vutbr.fit.api.bl.facades;


import cz.vutbr.fit.api.bl.mappers.EmployeeMapper;
import cz.vutbr.fit.api.bl.models.detailModels.EmployeeDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.UserDetailModel;
import cz.vutbr.fit.api.bl.models.formModels.EmployeeFormModel;
import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.EntityPart;



import java.util.List;

@RequestScoped
public class EmployeeFacade extends FacadeBase<EmployeeEntity>{

    private UnitOfWork _unitOfWork;
    private EmployeeMapper _mapper;

    @Inject
    EmployeeFacade(UnitOfWork unitOfWork, EmployeeMapper mapper) {
        super(unitOfWork.getEmployeeRepository(), mapper, unitOfWork);
        this._unitOfWork = unitOfWork;
        this._mapper = mapper;
    }

    EmployeeFacade()
    {

    }


    public long Create(List<EntityPart> formData) throws Exception
    {

        EmployeeFormModel formModel = (EmployeeFormModel)_mapper.MapFormDataToFormModel(formData);

        if (formModel.getPassword().length()<6)
        {
            throw new Exception("HESLO MUSI MIT ALESPON 6 ZNAKU!");
        }

        return super.Create(_mapper.MapFormModelToEntity(formModel));
    }

    public long update(List<EntityPart> parts) throws Exception
    {

        EmployeeFormModel formModel = (EmployeeFormModel)_mapper.MapFormDataToFormModel(parts);
        return super.update(_mapper.MapFormModelToEntity(formModel));
    }

    public String getEmployeeRole(String name){
        return ((EmployeeDetailModel) _mapper.MapEntityToDetail(_unitOfWork.getEmployeeRepository().getEmployeeByEmail(name))).getRole();
    }
    
    public long updateField(List<EntityPart> parts, String email) throws Exception
    {
        var updateFieldModel = _mapper.mapFormToUpdateFieldModel(parts);
        EmployeeEntity user = _unitOfWork.getEmployeeRepository().getById(updateFieldModel.id);
        
        if(!user.getEmail().equals(email)){
        	throw new Exception("YOU CAN NOT CHANGE OTHER USERS!");
        }
        
        _unitOfWork.beginTransaction();
        var result = _repository.UpdateField(updateFieldModel);
        _unitOfWork.commit();
        return result;
    }

}
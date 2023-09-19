package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.bl.facades.interfaces.IFacade;
import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.repositories.RepositoryBase;
import cz.vutbr.fit.api.dal.repositories.interfaces.IRepository;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.ws.rs.core.EntityPart;

import java.util.List;


public abstract class FacadeBase<TEntity extends IEntity> implements IFacade<TEntity>, AutoCloseable {

    protected RepositoryBase _repository;
    private IMapper mapper;

    protected UnitOfWork _unitOfWork;

    FacadeBase(RepositoryBase repository, IMapper mapper, UnitOfWork unitOfWork)
    {
        this._repository = repository;
        this.mapper=mapper;
        this._unitOfWork = unitOfWork;
    }

    FacadeBase()
    {

    }

    public List<IListModel> getAll()
    {
        return  mapper.MapEntitiesToList(_repository.getAll());
    }

    public void removeAll(){
        _unitOfWork.beginTransaction();
        _repository.removeAll();
        _unitOfWork.commit();
    }

    public int generateBasicAccounts()
    {

        _unitOfWork.beginTransaction();
        var result = _repository.generateBasicAccounts();
        _unitOfWork.commit();
        return result;

    }


    public long Create(List<EntityPart> formData) throws Exception
    {
        _unitOfWork.beginTransaction();
        var result = _repository.Insert(mapper.MapFormDataToEntity(formData));
        _unitOfWork.commit();
        return result;
    }

    public long Create(IEntity entity)
    {
        String msg ="";
        try{
            _unitOfWork.beginTransaction();
            var result = _repository.Insert(entity);
            _unitOfWork.commit();

            return result;
        }
        catch (Exception e) {
            msg =  e.getMessage();

        }
        return -1;
    }


    public IDetailModel getById(long id){
        return mapper.MapEntityToDetail(_repository.getById(id));
    }


    public long entityGenerator(){
        _unitOfWork.beginTransaction();
        var result = _repository.entityGenerator();
        _unitOfWork.commit();
        return result;
    }


    public long update(List<EntityPart> parts) throws Exception
    {
        _unitOfWork.beginTransaction();
        var result = _repository.Update(mapper.MapFormDataToEntity(parts));
        _unitOfWork.commit();
        return result;
    }

    public long update(IEntity entity)
    {
        _unitOfWork.beginTransaction();
        var result = _repository.Update(entity);
        _unitOfWork.commit();
        return result;
    }


    public long updateField(List<EntityPart> parts) throws Exception
    {
        var updateFieldModel = mapper.mapFormToUpdateFieldModel(parts);

        _unitOfWork.beginTransaction();
        var result = _repository.UpdateField(updateFieldModel);
        _unitOfWork.commit();
        return result;
    }



    public void removeById(long id)
    {
        _unitOfWork.beginTransaction();
        _repository.removeById(id);
        _unitOfWork.commit();
    }


    @Override
    public void close() throws Exception {
        _repository.close();
    }
}

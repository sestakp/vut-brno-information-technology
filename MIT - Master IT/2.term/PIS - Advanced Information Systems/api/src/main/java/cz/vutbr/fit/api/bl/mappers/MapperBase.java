package cz.vutbr.fit.api.bl.mappers;

import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.IEndModel;
import cz.vutbr.fit.api.bl.models.formModels.IFormModel;
import cz.vutbr.fit.api.bl.models.formModels.ReviewFormModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.listModels.RoomListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.ReviewEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.ws.rs.core.EntityPart;
import org.modelmapper.ModelMapper;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static cz.vutbr.fit.api.common.transformer.EntityPartTransformer.*;
import static cz.vutbr.fit.api.common.transformer.EntityPartTransformer.getString;

public abstract class MapperBase<TEntity extends IEntity, TFormModel extends IFormModel,
        TDetailModel extends IDetailModel, TListModel extends IListModel,
        TEndModel extends IEndModel> implements IMapper {

    Class<TEntity> _entityType;
    Class<TFormModel> _formModelType;

    Class<TDetailModel> _detailModelType;

    Class<TListModel> _listModelType;

    Class<TEndModel> _endModelType;
    ModelMapper modelMapper = new ModelMapper();
    DateTimeFormatter formatter;

    public MapperBase(Class<TEntity> entityType, Class<TFormModel> formModelType,
                      Class<TDetailModel> detailModelType, Class<TListModel> listModel, Class<TEndModel> endModel)
    {
        this._entityType = entityType;
        this._formModelType = formModelType;
        this._detailModelType = detailModelType;
        this._listModelType = listModel;
        this._endModelType = endModel;
        this.formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    }


    public IDetailModel MapEntityToDetail(IEntity _entity){

        return modelMapper.map(_entity, _detailModelType);
    }

    public IListModel MapEntityToList(IEntity _entity){

        return modelMapper.map(_entity, _listModelType);
    }

    public IEndModel MapEntityToEnd(IEntity _entity)
    {
        return modelMapper.map(_entity, _endModelType);
    }


    public IEntity MapFormDataToEntity(List<EntityPart> data) throws Exception{

        IEntity entity = _entityType.getDeclaredConstructor().newInstance();
        //TODO.... EXTRACT, THIS PART IS REDUNDANT
        for (EntityPart part : data)
        {
            try{
                Field field = _entityType.getDeclaredField(part.getName());
                field.setAccessible(true);

                if (field.getType().equals(String.class))
                {
                    field.set(entity, getString(part));
                }
                else if (field.getType().equals(int.class))
                {
                    field.set(entity, getInt(part));
                }
                else if (field.getType().equals(long.class))
                {
                    field.set(entity, getLong(part));
                }
                else if (field.getType().equals(List.class))
                {
                    List list = (List)field.get(entity);
                    list.add(getString(part));
                    field.set(entity, list);

                }
                else if (field.getType().equals(LocalDate.class)){
                    field.set(entity, LocalDate.parse(getString(part),formatter));
                }
            }
            catch (Exception e){

            }

        }

        return entity;
    }



    public List<IListModel> MapEntitiesToList(List<IEntity> entities){
        var userListModel = new ArrayList<IListModel>();
        for(IEntity entity : entities){
            userListModel.add(MapEntityToList(entity));
        }
        return userListModel;
    }


    public UpdateFieldModel mapFormToUpdateFieldModel(List<EntityPart> parts) throws  Exception
    {

        UpdateFieldModel model = new UpdateFieldModel();

        //TODO.... EXTRACT, THIS PART IS REDUNDANT
        for (EntityPart p : parts)
        {
            if (p.getName().equals("id")) {
                model.id = getInt(p);
                continue;
            }
            else
            {
                model.fieldName = p.getName();

                if(model.fieldName.equals("password")){
                    model.value = getString(p);
                    continue;
                }
                if (model.fieldName.equals("state") || model.fieldName.equals("city") ||
                        model.fieldName.equals("zipCode") || model.fieldName.equals("street")){
                    model.value = getString(p);

                    continue;
                }

                Field field = _entityType.getDeclaredField(model.fieldName);


                if (field.getType().equals(String.class))
                {
                    model.value = getString(p);
                }
                else if (field.getType().equals(int.class))
                {
                    model.value = getInt(p);
                }
                else if (field.getType().equals(long.class))
                {
                    model.value = getLong(p);
                }
                else if (field.getType().equals(List.class)){
                    model.value = getString(p);
                }
                else if (field.getType().equals(Boolean.class)){
                    model.value = Boolean.parseBoolean(getString(p));
                }
                else{
                    throw new Exception("Unsupported mapping for: "+field.getType().toString());
                }



            }
        }

        return model;
    }


    public IFormModel MapFormDataToFormModel(List<EntityPart> data) throws Exception
    {
        IFormModel formModel = _formModelType.getDeclaredConstructor().newInstance();

        //TODO.... EXTRACT, THIS PART IS REDUNDANT
        for (EntityPart part : data)
        {
            try{
                Field field = _formModelType.getDeclaredField(part.getName());
                field.setAccessible(true);

                if (field.getType().equals(String.class))
                {
                    field.set(formModel, getString(part));
                }
                else if (field.getType().equals(int.class))
                {
                    field.set(formModel, getInt(part));
                }
                else if (field.getType().equals(long.class))
                {
                    field.set(formModel, getLong(part));
                }
                else if (field.getType().equals(List.class))
                {
                    List list = (List)field.get(formModel);
                    list.add(getString(part));
                    field.set(formModel, list);
                }
                else if (field.getType().equals(LocalDate.class)){
                    field.set(formModel, LocalDate.parse(getString(part),formatter));
                }
            }
            catch (Exception e){

            }

        }

        return formModel;
    }




}

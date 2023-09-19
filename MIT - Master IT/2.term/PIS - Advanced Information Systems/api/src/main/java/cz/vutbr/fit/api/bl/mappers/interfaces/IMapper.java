package cz.vutbr.fit.api.bl.mappers.interfaces;

import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.ws.rs.core.EntityPart;

import java.util.ArrayList;
import java.util.List;

public interface IMapper {

    IEntity MapFormDataToEntity(List<EntityPart> data) throws Exception;

    IDetailModel MapEntityToDetail(IEntity entity);

    List<IListModel> MapEntitiesToList(List<IEntity> list);

    UpdateFieldModel mapFormToUpdateFieldModel(List<EntityPart> parts) throws Exception;
}

package cz.vutbr.fit.api.bl.mappers;


import cz.vutbr.fit.api.bl.mappers.interfaces.IMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.bl.models.detailModels.RoomDetailModel;
import cz.vutbr.fit.api.bl.models.endModels.RoomEndModel;
import cz.vutbr.fit.api.bl.models.listModels.IListModel;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.listModels.RoomListModel;
import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.enterprise.context.ApplicationScoped;



@ApplicationScoped
public class RoomMapper extends MapperBase<RoomEntity, RoomFormModel, RoomDetailModel, RoomListModel, RoomEndModel>{

    public RoomMapper(){
        super(RoomEntity.class, RoomFormModel.class, RoomDetailModel.class, RoomListModel.class
        , RoomEndModel.class);
    }


}

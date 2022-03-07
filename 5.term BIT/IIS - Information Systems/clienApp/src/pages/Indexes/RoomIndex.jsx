/**
 * Author: Pavel Šesták
 */
import IndexBase from "./IndexBase";
import RoomActions from "../../redux/rooms/roomActions";
import * as RoomLibrary from "../../utils/renderLibraries/RoomLibrary";
import RoomSelector from "../../redux/rooms/roomSelector";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";
import RoomCard from "../../components/CardTable/Cards/RoomCard/RoomCard";
export function RoomIndex(props){


    return(
        <>
        <IndexBase 
            header="Rooms"
            collection="room"
            actions={RoomActions}
            recordLibrary={RoomLibrary}
            selector={RoomSelector}
            inDetail={props.inDetail}
            detailLink={"/room/detail"}
            updateLink={"/room/update"}
            fetchParams={props.fetchParams}
            cardTableHasImage={false}
            Card={RoomCard}
            noMargin={true}
        />
        </>
    )
}
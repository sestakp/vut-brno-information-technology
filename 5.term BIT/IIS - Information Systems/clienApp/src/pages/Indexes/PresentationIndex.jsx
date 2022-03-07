/**
 * Author: Pavel Šesták
 */
import { useEffect } from "react";
import IndexBase from "./IndexBase";
import PresentationActions from "../../redux/presentations/presentationActions";
import * as PresentationLibrary from "../../utils/renderLibraries/PresentationLibrary";
import PresentationSelector from "../../redux/presentations/presentationSelector";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";
import PresentationCard from "../../components/CardTable/Cards/PresentationCard/PresentationCard";
import { connect } from "react-redux";


export function PresentationIndex(props){

    useEffect(() => {
        
    }, [])

    return(
        <>
        <IndexBase 
            header="Presentations"
            collection="presentation"
            actions={PresentationActions}
            recordLibrary={PresentationLibrary}
            selector={PresentationSelector}
            inDetail={props.inDetail}
            redirectPath={props.redirectPath}
            detailLink={"/presentation/detail"}
            updateLink={"/presentation/update"}
            fetchParams={props.fetchParams}
            cardTableHasImage={true}
            Card={PresentationCard}
            presentationApproving={props.presentationApproving}
            noMargin={true}
        />
        </>
    )
}



const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PresentationIndex);
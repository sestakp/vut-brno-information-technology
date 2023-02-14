/**
 * Author: Pavel Šesták
 */
import React, { useState } from 'react';
import "./RecordEditPanel.css";
import { Grid } from "@material-ui/core";
import { connect} from "react-redux";
import { useHistory } from 'react-router';
import ButtonNormal from "../../components/ButtonNormal/ButtonNormal";
import RecordDeleteDialog from "../RecordsDeleteDialog/RecordsDeleteDialog";

const RecordEditPanel = (props) => {
    const history = useHistory();
    const [dialogOpen, setDialogOpen] = useState(false);
    let visibility = (props.selectedRecords?.length !== 0) ? "visible" : "hidden"

    function del(){
        props.selectedRecords.forEach(record => {
            props.delete(record);
        })
    
        props.clear();
    }

    return(
        
        <div className="RecordEditPanel sticky-top sticky-offset bg-white-no-important dark:bg-neutral-700 shadow" style={{
            visibility: visibility,
            display: "flex",
            paddingLeft: "20px",
            paddingBottom: "2px"
            }}>
            <RecordDeleteDialog 
                count={props.selectedRecords.length}
                handleDisagree={() => setDialogOpen(false)}
                handleAgree={() => {del(); setDialogOpen(false); }}
                open={dialogOpen}
            />
            <ButtonNormal style={{margin: "3px"}} disabled={props.selectedRecords.length !== 1} onClick={() => history.push(props.updateLink)}>Edit</ButtonNormal>
            <ButtonNormal style={{margin: "3px"}} onClick={() => setDialogOpen(true)} variant="outlined">Delete</ButtonNormal>
            <ButtonNormal style={{margin: "3px"}} disabled={props.selectedRecords.length !== 1} onClick={() => history.push(props.detailLink+"/"+props.firstRecord.id)}>Detail</ButtonNormal>
            <ButtonNormal style={{margin: "3px"}} onClick={props.clear} className="float-end" variant="outlined" style={{
                position: "absolute",
                right: "20px",
                margin: "5px"
            }}>Clear</ButtonNormal>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    selectedRecords: ownProps.selector.getSelectedRecords(state),
    firstRecord: ownProps.selector.getFirstSelectedRecord(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    clear: () => dispatch(ownProps.actions.ClearSelected()),
    delete: (record) => dispatch(ownProps.actions.Delete(record)),
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(RecordEditPanel);
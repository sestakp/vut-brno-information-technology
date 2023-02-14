import React, { useState} from 'react';
import "./RecordEditPanel.css";
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Button, Paper } from "@material-ui/core";
import { useHistory } from 'react-router';
import { RootState } from "../../app/store";
import Model from "../../models/api/Model";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { AsyncThunk, AnyAction } from "@reduxjs/toolkit";


interface Props{
    clearSelectedRecords: ActionCreatorWithoutPayload<string>,
    selectIsAnyRecordSelected: (state: RootState) => boolean,
    selectIsOneRecordSelected: (state: RootState) => boolean,
    selectSelectedRecords: (state: RootState) => Model[],
    updateLink: string,
    detailLink: string,
    selectFirstSelectedRecord: (state: RootState) => Model,
    deleteAsync: AsyncThunk<void, Model, {}>,
}

const RecordEditPanel = (props: Props) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const isOneRecordSelected = useAppSelector(props.selectIsOneRecordSelected);
    const isAnyRecordSelected = useAppSelector(props.selectIsAnyRecordSelected);
    const selectedRecords = useAppSelector(props.selectSelectedRecords);
    const firstRecord = useAppSelector(props.selectFirstSelectedRecord);


    let visibility: any = (isAnyRecordSelected) ? "visible" : "hidden"

    function del(){
        selectedRecords.forEach(record => {
            dispatch(props.deleteAsync(record));
        })
    
        dispatch(props.clearSelectedRecords());
    }



    return(
        <Paper elevation={3} className="RecordEditPanel sticky-top pl-6 pr-6" style={{visibility: visibility}}>
             <DeleteDialog 
                count={selectedRecords.length}
                handleDisagree={() => setDialogOpen(false)}
                handleAgree={() => {del(); setDialogOpen(false); }}
                open={dialogOpen}

            />
            <Button disabled={ ! isOneRecordSelected} onClick={() => history.push(props.updateLink)} variant="outlined">Edit</Button>
            <Button onClick={() => setDialogOpen(true)} variant="outlined">Delete</Button>
            <Button disabled={ ! isOneRecordSelected} onClick={() => history.push(props.detailLink+"/"+firstRecord.id)} variant="outlined">Detail</Button>
            <Button onClick={() => dispatch(props.clearSelectedRecords())} className="float-end" variant="outlined">Clear</Button>
        </Paper>
    )
}

  
export default RecordEditPanel;

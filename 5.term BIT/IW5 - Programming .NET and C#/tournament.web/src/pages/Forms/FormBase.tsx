import React, { useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import * as LibraryBase from "../../utils/renderUtils/baseRenderLibrary";
import "react-dropzone-uploader/dist/styles.css";
import { useHistory } from "react-router";
import Model from "../../models/api/Model";
import entityLibrary from "../../models/utils/renderUtils/entityLibrary";
import { AsyncThunk, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from "../../app/store";
import Constants from "../../utils/Constants";
import "./FormBase.css";
import Loading from "../../components/Loading/Loading";

interface Props{
  recordLibrary: entityLibrary,
  
  selectIsLoading: (state: RootState) => boolean,
  selectFormDefaultModel: (state: RootState) => Model,
  selectFirstSelectedRecord: (state: RootState) => Model,
  
  getFormDefaultModelAsync: AsyncThunk<void, void, {}>,
  createAsync: AsyncThunk<string, Model, {}>,
  updateAsync: AsyncThunk<string, Model, {}>,
  clearSelectedRecords: ActionCreatorWithoutPayload<string>,

  
}

function FormBase(props:Props) {
  const history = useHistory();
  const methods = useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(props.selectIsLoading);
  const formDefaultModel = useAppSelector(props.selectFormDefaultModel);

  let record: Model = useAppSelector(props.selectFirstSelectedRecord); 

  useEffect(() => {
    dispatch(props.getFormDefaultModelAsync());
  },[]);

  if(isLoading){
    return <Loading/>
  }

  record = {...formDefaultModel, ...record};

  const onSubmit = (data: Model) =>{
    
    console.log("OnSubmit: ",data);
    //Add new  
    if(record.id === Constants.GUID_EMPTY || record.id === undefined){
      dispatch(props.createAsync(data));
    }
    else{ //Update
      data.id = record.id;
      data.image = data.imagePath;
      data.imagePath = record.imagePath;
      
    console.log("OnSubmit2: ",data);
      dispatch(props.updateAsync(data));
    }
    history.goBack();
  } 
  
  return (
    <FormProvider {...methods} >
      
      <form className="detail-form p-3 m-1" onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item className="col-md-6 p-1">
            {LibraryBase.renderForm(
              0,
              Math.floor(props.recordLibrary.columnsToForm.length / 2 + 1),
              record,
              props.recordLibrary.columnsToForm,
              methods
            )}
          </Grid>
          <Grid item className="col-md-6 p-1">
            {LibraryBase.renderForm(
              Math.floor(props.recordLibrary.columnsToForm.length / 2 + 1),
              props.recordLibrary.columnsToForm.length,
              record,
              props.recordLibrary.columnsToForm,
              methods
            )}
          </Grid>
          <div className="m-auto">  
            <input type="submit" className="btn btn-color" value="Submit"/>
            <button type="reset" className="btn btn-secondary" onClick={() => { dispatch(props.clearSelectedRecords()); history.goBack();}}>Back</button>
          </div>
        </Grid>
      </form>
    </FormProvider>
  );
}

export default FormBase;
import React from "react";
import { Grid, Button } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import * as LibraryBase from "../../libraries/libraryBase";
import { connect } from "react-redux";
import "react-dropzone-uploader/dist/styles.css";
import * as pagingActions from "../../redux/paging/pagingActions"; 

function FormBase(props) {
  const methods = useForm();
  
  const onSubmit = (data) =>{
    
    //let ddd = JSON.parse(JSON.stringify(data));
    console.log("Data: ",data);
    
    //Add new  
    if(props.record.id === undefined){
      props.create(data);
    }
    else{ //Update
      data.id = props.record.id;
      props.update(data);
    }
    props.setIndex();

  } 
  
  console.log(methods.errors);

  return (
    <FormProvider {...methods} >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item className="col-md-6">
            {LibraryBase.renderForm(
              0,
              Math.floor(props.recordLibrary.dataSettings.length / 2 + 1),
              props.record,
              null,
              null,
              null,
              null,
              props.recordLibrary.dataSettings,
              null,
              null,
              methods
            )}
          </Grid>
          <Grid item className="col-md-6">
            {LibraryBase.renderForm(
              Math.floor(props.recordLibrary.dataSettings.length / 2 + 1),
              props.recordLibrary.dataSettings.length,
              props.record,
              null,
              null,
              null,
              null,
              props.recordLibrary.dataSettings,
              null,
              null,
              methods
            )}
          </Grid>
          <input type="submit" />
          <button onClick={() => props.setIndex()}>Back</button>
        </Grid>
      </form>
    </FormProvider>
  );
}
const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  record: state.record,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setIndex: () => {
    dispatch(pagingActions.setIndex());
  },
  create: (model) => {
    dispatch(ownProps.actions?.Create(model));
  },
  update: (model) => {
    dispatch(ownProps.actions?.Update(model));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(FormBase);
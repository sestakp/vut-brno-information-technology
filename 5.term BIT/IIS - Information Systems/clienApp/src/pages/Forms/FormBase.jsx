/**
 * Author: Pavel Šesták
 */
import React, { useEffect, useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Grid, Button, Paper } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import * as baseRenderLibrary from "../../utils/renderLibraries/baseRenderLibrary";
import { connect } from "react-redux";
import "./FormBase.css";
import { useHistory } from "react-router";
import Alert from 'react-bootstrap/Alert'

import ButtonForm from '../../components/ButtonForm/ButtonForm';
import ButtonNormal from '../../components/ButtonNormal/ButtonNormal';

function FormBase(props) {
  let record = {};
  const methods = useForm();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    //Add new
    if (record.id === undefined) {
      props.create(data).then(_ => setSubmitted(true));
    } else {
      //Update
      data.id = record.id;
      props.update(data).then(_ => setSubmitted(true));
    }
    
  };

  useEffect(() => {
    props.resetErrors();
  }, [])

  useEffect(() => {
    if(submitted && ! props.loading && Object.keys(props.errors).length === 0){
      props.clear();
      history.goBack();
      setSubmitted(false);
    }
  },[submitted, props.loading, props.errors])

  
  record = { ...props.record, ...props.formData }


  if (record === undefined) {
    return "";
  }
  

  return (
    <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">

        <div className="mb-5 space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 sm:p-6 text-neutral-900 dark:text-neutral-200">
                  {Object.keys(props.errors).map((key, i) => (
                    <Alert key={key} variant="danger">
                      Error: {props.errors[key]}
                    </Alert>
                  ))}
                  <Grid container >
                    <Grid item className="col-md-6 p-1">
                      {baseRenderLibrary.renderForm(
                        0,
                        Math.floor(props.recordLibrary.columnsToForm.length / 2 + 1),
                        record,
                        props.recordLibrary.columnsToForm,
                        methods,
                        props.isOwner
                      )}
                    </Grid>
                    <Grid item className="col-md-6 p-1">
                      {baseRenderLibrary.renderForm(
                        Math.floor(props.recordLibrary.columnsToForm.length / 2 + 1),
                        props.recordLibrary.columnsToForm.length,
                        record,
                        props.recordLibrary.columnsToForm,
                        methods,
                        props.isOwner
                      )}
                    </Grid>
                  </Grid>
                </div>
                <div className="flex justify-end px-4 py-3 bg-neutral-50 dark:bg-neutral-600 sm:px-6">
                  <ButtonNormal type="button" onClick={() =>{ props.clear(); history.goBack(); }}>Back</ButtonNormal>
                  <ButtonForm style={{ marginLeft: "10px" }}>Save</ButtonForm>
                </div>
              </form>
            </FormProvider>
            
          </div>
        </div>

      </div>
    </div>
  );
}
const mapStateToProps = (state, ownProps) => ({
  loading: ownProps.selector.isLoading(state),
  record: ownProps.selector.getFirstSelectedRecord(state),
  errors: ownProps.selector.getErrors(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  create: (model) => dispatch(ownProps.actions?.Create(model)),
  update: (model) => dispatch(ownProps.actions?.Update(model)),
  clear: () => dispatch(ownProps.actions.ClearSelected()),
  resetErrors: () => dispatch(ownProps.actions.setErrors({})),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBase);

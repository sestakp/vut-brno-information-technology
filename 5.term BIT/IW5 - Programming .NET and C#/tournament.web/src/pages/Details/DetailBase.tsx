import React, { useEffect } from "react";
import { Grid, Button, Paper } from "@material-ui/core";
import * as baseRenderLibrary from "../../utils/renderUtils/baseRenderLibrary";
import { useHistory } from "react-router";
import entityLibrary from "../../models/utils/renderUtils/entityLibrary";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Model from "../../models/api/Model";
import { RootState } from "../../app/store";
import { AsyncThunk, AnyAction, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';


interface Props{
  recordLibrary: entityLibrary,
  record:any,
  clearSelectedRecords: ActionCreatorWithoutPayload<string>,
};

function DetailBase(props: Props) {
  const history = useHistory();
  const dispatch = useAppDispatch();
  
  return (
    <div className="detail-container">
      <Paper elevation={3} className="p-3 m-2">
        <Grid container>
          <Grid item className="col-md-6 p-1">
            {baseRenderLibrary.renderDetail(
              0,
              Math.floor(props.recordLibrary.dataSettings.length / 2 + 1),
              props.record,
              props.recordLibrary.dataSettings
            )}
          </Grid>
          <Grid item className="col-md-6 p-1">
            {baseRenderLibrary.renderDetail(
              Math.floor(props.recordLibrary.dataSettings.length / 2 + 1),
              props.recordLibrary.dataSettings.length,
              props.record,
              props.recordLibrary.dataSettings
            )}
          </Grid>
          <div className="m-auto">
            <Button
              onClick={() => {
                dispatch(props.clearSelectedRecords());
                history.goBack();
              }}
              variant="outlined"
            >
              Back
            </Button>
          </div>
        </Grid>
      </Paper>
    </div>
  );
}

export default DetailBase;
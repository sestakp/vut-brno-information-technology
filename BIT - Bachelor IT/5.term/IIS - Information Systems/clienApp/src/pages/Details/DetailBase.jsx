/**
 * Author: Vojtěch Kulíšek
 */
import React, { useEffect, useState } from "react";
import { Grid, Button, Paper } from "@material-ui/core";
import * as baseRenderLibrary from "../../utils/renderLibraries/baseRenderLibrary";
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import ButtonNormal from '../../components/ButtonNormal/ButtonNormal';
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loading from "../../components/Loading/Loading";
import "./DetailBase.css";

function DetailBase(props) {
  const history = useHistory();
  return (
    <div className="mb-3 space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 sm:p-6 text-neutral-900 dark:text-neutral-200">
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
          </Grid>
        </div>
        <div className="flex justify-end px-4 py-3 bg-neutral-50 dark:bg-neutral-600 sm:px-6">
          <ButtonNormal
            onClick={() => {
              props.clear();
              history.goBack();
            }}
          >
            Back
          </ButtonNormal>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  record: ownProps.selector.getById(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  clear: () => dispatch(ownProps.actions.ClearSelected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailBase);

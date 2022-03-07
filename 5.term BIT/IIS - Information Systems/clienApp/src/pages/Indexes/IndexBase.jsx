/**
 * Author: Pavel Šesták
 */
import React, { useEffect } from "react";
import CardTable from "../../components/CardTable/CardTable";
import ButtonNormal from "../../components/ButtonNormal/ButtonNormal";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";
import { connect, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { useHistory } from "react-router";

const IndexBase = (props) => {
  let history = useHistory();
  useEffect(() => {

    props.clearSelectedRecords();
    props.fetch();
  }, []);

  let margin = {margin: "0 25px"};
  if(props.noMargin){
    margin = {};
  }



  return (
    <>
        <RecordEditPanel
                actions={props.actions}
                selector={props.selector}
                detailLink={props.detailLink}
                updateLink={props.updateLink}
        />
        <div style={margin}>
          <div style={{
            position: "relative",
            display: "flex",
            }}>
          <h1 style={{
            marginBottom: "25px"
            }}>{props.header}</h1>
            <ButtonNormal
              onClick={() => history.push(props.updateLink)}
              style={{
                position: "absolute",
                right: "0",
                marginTop: "5px"
              }}
            >
              Add
            </ButtonNormal>
          </div>

        <CardTable
          recordLibrary={props.recordLibrary}
          actions={props.actions}
          selector={props.selector}
          detailLink={props.detailLink}
          Card={props.Card}
          presentationApproving={props.presentationApproving}
        />
        </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetch: () => dispatch(ownProps.actions?.Fetch(ownProps.fetchParams)),
  clearSelectedRecords: () => dispatch(ownProps.actions?.ClearSelected()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexBase);

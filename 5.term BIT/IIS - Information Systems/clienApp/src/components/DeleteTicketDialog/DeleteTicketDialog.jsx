/**
 * Author: Lukáš Plevač
 */
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonNormal from "../ButtonNormal/ButtonNormal";
import "./DeleteTicketDialog.css";


function DeleteTicketDialog(props) {
  
    return (
      <div>
        <Dialog
          open={props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete ticket"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete {props.ticket?.name} ticket?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonNormal onClick={props.handleDisagree}>
              Cancel
            </ButtonNormal>
            <ButtonNormal onClick={props.handleAgree}>
              Delete
            </ButtonNormal>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default DeleteTicketDialog;

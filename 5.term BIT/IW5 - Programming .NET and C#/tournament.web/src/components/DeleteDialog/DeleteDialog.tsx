import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Props{
  open: boolean,
  count: Number,
  handleDisagree: () => void,
  handleAgree: () => void,
}

function RecordsDeleteDialog(props: Props) {
  
    return (
      <div>
        <Dialog
          open={props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete records"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete {props.count} records?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            
          <Button onClick={props.handleDisagree} variant="outlined">Cancel</Button>
          
          <Button onClick={props.handleAgree} variant="outlined" color="secondary">Delete</Button>

          </DialogActions>
        </Dialog>
      </div>
    );
}

export default RecordsDeleteDialog;

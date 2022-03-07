/**
 * Author: Vojtěch Kulíšek
 */
import React, { Component, useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import TicketActions from "../../../redux/tickets/ticketActions";
import { connect } from "react-redux";
import DeleteTicketDialog from "../../DeleteTicketDialog/DeleteTicketDialog";

function TicketStatusSelect(props) {

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Autocomplete
      options={["reserved", "paid", "picked up", "Cancel ticket"]}
      value={props.visitor?.status}
      onChange={onChange}
      renderInput={renderInput}
      renderOption={renderOption}
      size="small"
    />
  );

  function onChange(event, newValue) {
    //props.handleRecordChange(newValue?.id ?? newValue);
    if(newValue !== "Cancel ticket"){
        let visitor = props.visitor;
        visitor.status = newValue;
        props.UpdateTicket(visitor);
    }
    else{
        setOpenDeleteDialog(true);
        //props.DeleteTicket(props.visitor);
    }
  }

  function renderOption(option, { inputValue }) {
    const matches = match(option, inputValue);
    const parts = parse(option, matches);

    return (
      <div>
        <span className="badge bg-info">
            {parts.map((part, index) => (
            <span key={"ticketStatusSelect"+index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
            </span>
            ))}
        </span>
      </div>
    );
  }

  function renderInput(params) {
    return (
      <>
      <DeleteTicketDialog 
        open={openDeleteDialog}
        ticket={props.visitor}
        handleDisagree={() => setOpenDeleteDialog(false) }
        handleAgree={() => { props.DeleteTicket(props.visitor); setOpenDeleteDialog(false); }}
      />
      <TextField
        {...params}
        value={props.visitor.status}
        onChange={props.handleInputChange}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      </>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    DeleteTicket: (ticket) => dispatch(TicketActions.Delete(ticket)),
    UpdateTicket: (ticket) => dispatch(TicketActions.Update(ticket)),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(TicketStatusSelect);
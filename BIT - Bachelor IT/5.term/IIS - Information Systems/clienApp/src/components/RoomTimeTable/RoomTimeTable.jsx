/**
 * Author: Vojtěch Kulíšek
 */
import React, { useState, useEffect} from "react";
import moment from "moment";
import { useHistory } from "react-router";
import "./RoomTimeTable.css";
import { NavLink } from "react-router-dom";

export default function RoomTimeTable(props){
  

  let presentations = props.presentations.filter( x=> x.room_id !== props.room_id && x.state === "approved");

  const history = useHistory();
  if(presentations === undefined || presentations.length === 0){
    return <p></p>
  }

  //Set bounding of timetable
  let startDates = presentations.map(presentation => new Date(presentation.start));
  let endDates = presentations.map(presentation => new Date(presentation.finish));

  //Get dates
  var minDate=new Date(Math.min.apply(null,startDates.concat(endDates)));
  var maxDate=new Date(Math.max.apply(null,endDates.concat(startDates)));
  
  var currentDate = minDate;
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  var dates = [];

  while(currentDate <= maxDate){
    dates.push(moment(currentDate));
    currentDate = moment(currentDate).add(1, 'days');
  }


  //Get hours
  let startHours = startDates.concat(endDates).map((date) => date.getHours());
  let endHours = startDates.concat(endDates).map((date) => date.getHours());
  

  var minHour= Math.min.apply(null,startHours);
  var maxHour= Math.max.apply(null,endHours);


  let presentationsToSplit= presentations.filter(x => moment(x.start).days() !== moment(x.finish).days());
  if(presentationsToSplit.length !== 0){
    presentationsToSplit.forEach((presentation) => {

      let newPresentation = JSON.parse(JSON.stringify(presentation));
      newPresentation.start = new Date(newPresentation.finish);
      newPresentation.start.setHours(0); 
      newPresentation.start.setMinutes(0);
      presentations.push(newPresentation);
    })
    minHour = 0;
    maxHour = 24;
  }

  var currentHour = minHour;
  var hours = [];

  while(currentHour <= maxHour){
    hours.push(currentHour);
    currentHour++;
  }

  const formatter = new Intl.NumberFormat('cs', {
    minimumIntegerDigits: 2,
    useGrouping: false,
 }); 

function renderColumn(date, hours){

  let presentation = null;

  function isInsidePresentation(date, hour){
    let retval = presentations.map(
      x => {
        let start = moment(x.start);
        //Its start
        if(start.isSame(date, 'day') &&
        start.hours() === hour) {
          let finish = moment(x.finish);

          var duration = moment.duration(finish.diff(start));
          var durationHours = duration.asHours();
          presentation = x;
          return durationHours;
        }
        return null;
      }
    )
    retval = retval.filter(x => x !== null);
    return retval.length === 0 ? 0 : retval[0];
  }

  let duration = 0;
  return hours.map((hour) => 
  {
    
    if(duration != 0){
      duration--;
      presentation = null;
      return "";
    }

    if(duration === 0){
      duration = isInsidePresentation(date, hour);
    }

    if(duration > 0){
      duration--;
    }

    if(presentation !== null){
      let id = presentation?.id;
      return (
        <th 
          colSpan={duration+1} 
          style={{border: "1px solid black", cursor: "pointer"}} 
          className="dark:bg-neutral-700"
          onClick={() => history.push("/presentation/detail/"+id)} 
        >
          {presentation?.name}
        </th>
      )
    }
    return(
      <th>
      </th>
    )
  }
  )
}
    return (
      <div style={{maxWidth: "100%", overflow: "scroll"}}>
        <h2>Room timetable</h2>
        <table style={{}}>
        <tr>
          <th></th>
          {hours.map((hour) => <th>{formatter.format(hour)}:00 h</th>)}
        </tr>
        {dates.map((date, index) => 
          <>
          <tr>
            <th>{date.format("DD. MMM YYYY")}</th>
            {renderColumn(date, hours)}
          </tr>
          </>
        )}
      </table>
      </div>
    );
}

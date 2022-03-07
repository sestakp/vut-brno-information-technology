 import React, { useState, useEffect} from "react";
 import moment from "moment";
 import { useHistory } from "react-router";
 import { NavLink } from "react-router-dom";
 import Game from "../../models/Entities/Game";
 import "./TournamentVenueTimetable.css"
 
interface Props{
  games: Game[],
}

 export default function TournamentVenueTimetable(props: Props){
   
  var games:Game[] = props.games;

   const history = useHistory();

   if(games === undefined || games.length === 0){
     return <p></p>
   }

 
   //Set bounding of timetable
   let startDates = games.map(game => new Date(game.start ?? ""));
   let endDates = games.map(game => new Date(game.end ?? ""));
   
   //Get dates
   var minDate=new Date(Math.min.apply(null,startDates.concat(endDates).map(date => date.getTime())));
   var maxDate=new Date(Math.max.apply(null,endDates.concat(startDates).map(date => date.getTime())));
   

   var currentDate = minDate;
   currentDate.setHours(0);
   currentDate.setMinutes(0);
   var dates = [];
 
   while(currentDate <= maxDate){
     dates.push(moment(currentDate));
     currentDate = moment(currentDate).add(1, 'days').toDate();
   }
 
 
   //Get hours
   let startHours = startDates.concat(endDates).map((date) => date.getHours());
   let endHours = startDates.concat(endDates).map((date) => date.getHours());
   
 
   var minHour= Math.min.apply(null,startHours);
   var maxHour= Math.max.apply(null,endHours);
 
 
   let gamesToSplit = games.filter(x => moment(x.start).days() !== moment(x.end).days());


   let gamesToAdd:Game[] = [];
   if(gamesToSplit.length !== 0){
    gamesToSplit.forEach((game, index) => {
        


       let newGame = JSON.parse(JSON.stringify(game));
       newGame.start = new Date(newGame.end);
       newGame.start.setHours(0); 
       newGame.start.setMinutes(0);
       newGame.start = moment(newGame.start).format("YYYY-MM-DDTHH:mm:ss");
       gamesToAdd.push(newGame);

       let oldGame = JSON.parse(JSON.stringify(game));
       oldGame.end = new Date(oldGame.start);   
       oldGame.end = moment(oldGame.start).format("YYYY-MM-DDT24:00:00");
       gamesToAdd.push(oldGame);
     })
     minHour = 0;
     maxHour = 23;
   }

   
   games = games.filter(x => moment(x.start).days() === moment(x.end).days());
   games = games.concat(gamesToAdd);
   
   console.log("games :", games);
   var currentHour = minHour;
   var hours:Number[] = [];
 
   while(currentHour <= maxHour){
     hours.push(currentHour);
     currentHour++;
   }
 
   const formatter = new Intl.NumberFormat('cs', {
     minimumIntegerDigits: 2,
     useGrouping: false,
  }); 
 
 function renderColumn(date: Date, hours: Number[]){
 
   let game: Game|null = null;
 
   function isInsidegame(date: Date, hour: Number){
     let retval = games.map(
       x => {
         let start = moment(x.start);
         //Its start
         if(start.isSame(date, 'day') &&
         start.hours() === hour) {
           let end = moment(x.end);
 
           var duration = moment.duration(end.diff(start));
           var durationHours = duration.asHours();
           game = x;
           return durationHours;
         }
         return null;
       }
     )
     retval = retval.filter(x => x !== null);
     return retval.length === 0 ? 0 : retval[0];
   }
 
   let duration : number | null = 0;
   return hours.map((hour) => 
   {
    if(duration === null){
      return "";
    }
    
    if(duration != 0){
        duration--;
        game = null;
        return "";
      }
    
     if(duration === 0){
       duration = isInsidegame(date, hour);
       if(duration === 0){
         game = null;
       }
     }

     if(duration === null){
      return "";
    }
     
      if(duration > 0){
        duration--;
      }
    
     if(game !== null){
       let id = game?.id;
       console.log("Render game: ", game, duration)
       return (
         <th 
           colSpan={duration+1} 
           style={{cursor: "pointer"}} 
           className="table-text"
           onClick={() => history.push("/Game/detail/"+id)} 
         >
           {game?.teamRedName + " vs "+ game?.teamBlueName}
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
       <div className='time-table p-4' style={{maxWidth: "100%", overflow: "scroll"}}>
         <h2>Tournament venue timetable</h2>
         <table style={{}}>
         <tr>
           <th></th>
           {hours.map((hour) => <th>{formatter.format(hour as number)}:00 h</th>)}
         </tr>
         {dates.map((date, index) => 
           <>
           <tr>
             <th>{date.format("DD. MMM YYYY")}</th>
             {renderColumn(date.toDate(), hours)}
           </tr>
           </>
         )}
       </table>
       </div>
     );
 }
 
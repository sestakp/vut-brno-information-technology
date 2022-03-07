import * as libraryBase from "./baseRenderLibrary";
import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";

export const dataSettings: DataSettingColumn[] = [
    
    {
        id: "start",
        header: "Start",
        type: libraryBase.dataSettingTypes.DATETIME,
        rules: (getValues: (field: string) => any) => ({ 
            required: "Start is required",
            validate: () => getValues("start") < getValues("end") ? true : "Start must be lesser than finish"

        })

    },
    {
        id: "end",
        header: "Finish",
        type: libraryBase.dataSettingTypes.DATETIME,
        rules: (getValues: (field: string) => any) => ({ 
            required: "Finish is required", 
            validate: () => getValues("start") < getValues("end") ? true : "Finish must be greater than start"
        })

    },
    {
        id: "tournamentVenueId",
        header: "Tournament venue",
        type: libraryBase.dataSettingTypes.SELECT,
        selectDataProviderId: "tournamentVenues", 
        rules: (getValues: (field: string) => any) => ({ 
            required: "Tournament venue is required", 
        }),
    },
    {
       
        id: "teamRedName",
        header: "Team Red",
        type: libraryBase.dataSettingTypes.LINK,
        displayForm: false,
        path: "/Team/Detail/",
        suffix_id: "teamRedId",
    },
    {
        id: "teamRedId",
        header: "Team Red",
        type: libraryBase.dataSettingTypes.SELECT,
        selectDataProviderId: "teams",
        rules: (getValues: (field: string) => any) => ({ 
            required: "Team Red is required",
            validate: () => getValues("teamRedId") !== getValues("teamBlueId") ? true : "Team Red cannot be same with team blue"
        })
    },
    {
        id: "teamRedPoints",
        header: "Team Red Points",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues: (field: string) => any) => ({
            validate: () => {
                let points = Number(getValues("teamRedPoints")) as number;
                let bluePoints = Number(getValues("teamBluePoints")) as number;
                console.log("points: ", points);
                console.log("bluePOints: ", bluePoints);
                if(isNaN(getValues("teamRedPoints")) || points < 0 || points > 16){
                    return "Points must be in interval <0;16>"
                }

                if((points === 16) && (bluePoints === 16)){
                    return "Both teams cannot have 16 points";
                }
                return true;
            }
        })
    },
    {
        id: "teamBlueName",
        header: "Team Blue",
        type: libraryBase.dataSettingTypes.LINK,
        displayForm: false,
        path: "/Team/Detail/",
        suffix_id: "teamBlueId" 
    },
    {
        id: "teamBlueId",
        header: "Team Blue",
        type: libraryBase.dataSettingTypes.SELECT,
        selectDataProviderId: "teams",
        rules: (getValues: (field: string) => any) => ({ 
            required: "Team Blue is required",
            validate: () => getValues("teamRedId") !== getValues("teamBlueId") ? true : "Team Red cannot be same with team blue"
        })
    },
    {
        id: "teamBluePoints",
        header: "Team Blue Points",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues: (field: string) => any) => ({
            validate: () => {
                let points = Number(getValues("teamBluePoints")) as number;
                let bluePoints = Number(getValues("teamRedPoints")) as number;
                
                if(isNaN(getValues("teamBluePoints")) || points < 0 || points > 16){
                    return "Points must be in interval <0;16>"
                }

                if((points === 16) && (bluePoints === 16)){
                    return "Both teams cannot have 16 points";
                }

                return true;
            }
        })
    },
    {
        id: "tournamentVenueName",
        header: "Tournament Venue",
        type: libraryBase.dataSettingTypes.LINK,
        displayForm: false,
        path: "/TournamentVenue/Detail/",
        suffix_id: "tournamentVenueId" 
    },
]


export const columns = dataSettings.filter((record: DataSettingColumn) => record.displayTable !== false);


export const columnsToForm = dataSettings.filter(record => record.displayForm !== false);

export const columnsToFilter = dataSettings.filter(record => record.filter !== false);

export function filter(records: any[], filter:any){
    return records;   
}
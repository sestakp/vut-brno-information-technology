import * as libraryBase from "./baseRenderLibrary";
import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";
import Constants from "../Constants";
import filterBase from "../Filter";

export const dataSettings: DataSettingColumn[] = [
    {
        id: "teamEntityId",
        header: "Name of team",
        type: libraryBase.dataSettingTypes.SELECT,
        selectDataProviderId: "teams",
        rules: (getValues: (field: string) => any) => ({ 
            required: "Team is required",
            validate: () => getValues("teamEntityId") !== Constants.GUID_EMPTY ? true : "Team must be selected"
        }),
        filter: false,
    },
    {
        id: "name",
        header: "Name",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues: (field: string) => any) => ({ 
            required: "Name is required",
        }),
    },
    {
        id: "surname",
        header: "Surname",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues: (field: string) => any) => ({ 
            required: "Surname is required",
        }),
    },
    {
        id: "nickname",
        header: "Nickname",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues: (field: string) => any) => ({ 
            required: "Nickname is required",
        }),
    },
    {
        id: "description",
        header: "Description",
        type: libraryBase.dataSettingTypes.INPUT
    },    
    {
        id: "teamName",
        header: "Team",
        type: libraryBase.dataSettingTypes.LINK,
        displayForm: false,
        path: "/Team/Detail/",
        suffix_id: "teamEntityId",
        filter: false,
    },
    {
        id: "imagePath",
        header: "Image",
        type: libraryBase.dataSettingTypes.IMAGE,
        filter: false,
    },

]

export function cardTableSetTitle(record:any){
    return record.nickname;
}

export function cardTableSetDescription(record:any){
    return record.name + " " + record.surname;
}

export function cardTableSetFooter(record:any){
    return record.description;
}

export const columns = dataSettings.filter(record => record.displayTable !== false);

export const columnsToForm = dataSettings.filter(record => record.displayForm !== false);

export const columnsToFilter = dataSettings.filter(record => record.filter !== false);

export function filter(records: any[], filter:any){    
    return filterBase(records, filter);
}
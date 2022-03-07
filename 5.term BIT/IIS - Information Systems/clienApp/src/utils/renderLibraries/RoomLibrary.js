/**
 * Author: Vojtěch Kulíšek
 */
import * as baseRenderLibrary from "./baseRenderLibrary";
import filterBase from "./filter";

export const dataSettings = [
    {
        id: "conference_id",
        header: "Conference",
        type: baseRenderLibrary.dataSettingTypes.SELECT,
        selectDataProviderId: "conferences",
        rules: (getValues) => ({ required: "Conference is required" }),
        filter: false,
    },
    {
        id: "name",
        header: "Name",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ required: "Name is required", maxLength: 1400 })
    }
]

export const columns = dataSettings.filter(record => record.displayTable !== false);

export const columnsToForm = dataSettings.filter(record => record.displayForm !== false);

export const columnsToFilter = dataSettings.filter(record => record.filter !== false);

export const isValid = (object) => {
    return true;
}


export function filter(records, filter){    
    return filterBase(records, filter);
}

export function cardTableSetTitle(record){
    return record.name;
}

export function cardTableSetDescription(record){
    return "";
}

export function cardTableSetFooter(record){
    return "";
 }
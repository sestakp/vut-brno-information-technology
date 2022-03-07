/**
 * Author: Pavel Šesták
 */
import * as baseRenderLibrary from "./baseRenderLibrary";
import filterBase from "./filter";

export const dataSettings = [
    {
        id: "paid",
        header: "Paid",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400})
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
    return ""
}

export function cardTableSetDescription(record){
    return "";
}
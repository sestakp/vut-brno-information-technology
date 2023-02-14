import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";
import * as libraryBase from "./baseRenderLibrary";
import filterBase from "../Filter";

export const dataSettings: DataSettingColumn[] = [
    {
        id: "name",
        header: "Name",
        type: libraryBase.dataSettingTypes.INPUT,
        rules: (getValues) => ({ required: "Name is required" })
    },
    {
        id: "description",
        header: "Description",
        type: libraryBase.dataSettingTypes.INPUT
    },
    {
        id: "country",
        header: "Country",
        type: libraryBase.dataSettingTypes.INPUT
    },
    {
        id: "imagePath",
        header: "Image",
        type: libraryBase.dataSettingTypes.IMAGE,
        filter: false,
    }
]

export function cardTableSetTitle(record:any){
    return record.name;
}

export function cardTableSetDescription(record:any){
    return record.description;
}

export function cardTableSetFooter(record:any){
    return record.country;
}

export const columns = dataSettings.filter(record => record.displayTable !== false);


export const columnsToForm = dataSettings.filter(record => record.displayForm !== false);


export const columnsToFilter = dataSettings.filter(record => record.filter !== false);

export function filter(records: any[], filter:any){    
    return filterBase(records, filter);
}
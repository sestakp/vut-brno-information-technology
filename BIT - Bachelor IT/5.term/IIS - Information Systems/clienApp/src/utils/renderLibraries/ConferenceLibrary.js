/**
 * Author: Lukáš Plevač
 */
import * as baseRenderLibrary from "./baseRenderLibrary";
import * as validation from "./validations";
import filterBase from "./filter";

export const dataSettings = [
    {
        id: "name",
        header: "Name",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ required: "Name is required", maxLength: 1400 })
    },
    {
        id: "description",
        header: "Description",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400})
    },
    {
        id: "genre",
        header: "Genre",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400})
    },
    {
        id: "location",
        header: "Location",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400})
    },
    {
        id: "start",
        header: "Start",
        type: baseRenderLibrary.dataSettingTypes.DATETIME,
        rules: (getValues) => ({ 
            required: "Start is required",
            validate: () => getValues("start") < getValues("finish") ? true : "Start must be lesser than finish"
        })
        
    },
    {
        id: "finish",
        header: "Finish",
        type: baseRenderLibrary.dataSettingTypes.DATETIME,
        rules: (getValues) => ({ 
            required: "Finish is required", 
            validate: () => getValues("start") < getValues("finish") ? true : "Finish must be greater than start"
        })
    },
    {
        id: "price",
        header: "Price",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({
            validate: () => validation.nonNegativeNumber(getValues, "price"),
            maxLength: 1400
        }),
    },
    {
        id: "capacity",
        header: "Capacity",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ 
            required: "Capacity is required",  
            validate: () => validation.nonNegativeInteger(getValues, "capacity"),
            maxLength: 1400
        })
    },
    {
        id: "image",
        header: "Image",
        type: baseRenderLibrary.dataSettingTypes.IMAGE,
        filter: false,
    },
    {
        id: "user.name",
        header: "Author name",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        displayTable: false,
        displayForm: false,
    },
    {
        id: "only_valid",
        header: "Upcoming conferences",
        type: baseRenderLibrary.dataSettingTypes.CHECKBOX,
        displayTable: false,
        displayForm: false,
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
    return record.code+" ("+record.name+")";
}

export function cardTableSetDescription(record){
    return record.description;
}

export function cardTableSetFooter(record){
   return record.name;
}
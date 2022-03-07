/**
 * Author: Vojtěch Kulíšek
 */
import * as baseRenderLibrary from "./baseRenderLibrary";
import filterBase from "./filter";

export const dataSettings = [    
    {
        id: "conference_id",
        header: "Conference",
        type: baseRenderLibrary.dataSettingTypes.LINK,
        selectDataProviderId: "conferences",
        rules: (getValues) => ({ required: "Conference is required" }),
        filter: false,
        disable: true,
    },
    {
        id: "room_id",
        header: "Room",
        type: baseRenderLibrary.dataSettingTypes.SELECT,
        selectDataProviderId: "rooms",
        rules: (getValues) => ({ required: "Room is required" }),
        filter: false,
        ownerField: true,
    },
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
        id: "tags",
        header: "Tags",
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

        }),
        ownerField: true,
        minDateId: "conference.start",
        maxDateId: "conference.finish",
    },
    {
        id: "finish",
        header: "Finish",
        type: baseRenderLibrary.dataSettingTypes.DATETIME,
        rules: (getValues) => ({ 
            required: "Finish is required", 
            validate: () => getValues("start") < getValues("finish") ? true : "Finish must be greater than start"
        }),
        ownerField: true,
        minDateId: "conference.start",
        maxDateId: "conference.finish",
    },
    {
        id: "state",
        header: "State",
        type: baseRenderLibrary.dataSettingTypes.SELECT,
        selectDataProvider: ["pending", "approved", "declined"],rules: (getValues) => ({ 
            required: "State is required", 
        }),
        ownerField: true,
    },
    {
        id: "image",
        header: "Image",
        type: baseRenderLibrary.dataSettingTypes.IMAGE,
        filter: false,
    },
    {
        id: "file",
        header: "File",
        type: baseRenderLibrary.dataSettingTypes.ATTACHMENT,
        filter: false,
    },
    {
        id: "stream_link",
        header: "Stream link",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400}),
    },
    {
        id: "user.name",
        header: "Author name",
        type: baseRenderLibrary.dataSettingTypes.INPUT,
        rules: (getValues) => ({ maxLength: 1400}),
        displayTable: false,
        displayForm: false,
    },
    {
       
        id: "conference.name",
        header: "Conference",
        type: baseRenderLibrary.dataSettingTypes.LINK,
        displayForm: false,
        path: "/Conference/Detail/",
        suffix_id: "id",
    },
    {
       
        id: "room.name",
        header: "Room",
        type: baseRenderLibrary.dataSettingTypes.LINK,
        displayForm: false,
        path: "/Room/Detail/",
        suffix_id: "id",
    },
    {
        id: "only_valid",
        header: "Upcoming presentations",
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
    return record.name;
}

export function cardTableSetDescription(record){
    return (record.description ?? "") + "\n" + record.state;
}

export function cardTableSetFooter(record){
    let tagArray = record.tags?.split(/[\s]+/)
    
    return tagArray?.map(tag => <span class="badge bg-secondary">{tag}</span>)
}
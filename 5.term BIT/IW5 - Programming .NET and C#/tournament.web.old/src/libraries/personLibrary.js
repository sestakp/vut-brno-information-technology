import * as libraryBase from "./libraryBase";

export const dataSettings = [
    {
        id: "name",
        header: "Name",
        type: libraryBase.dataSettingTypes.INPUT
    },
    {
        id: "surname",
        header: "Surname",
        type: libraryBase.dataSettingTypes.INPUT
    },
    {
        id: "description",
        header: "Description",
        type: libraryBase.dataSettingTypes.INPUT
    },
    {
        id: "imagePath",
        header: "Image",
        type: libraryBase.dataSettingTypes.IMAGE
    },
    {
        id: "teamName",
        header: "Name of team",
        type: libraryBase.dataSettingTypes.INPUT
    }
]


export const columns = dataSettings.filter(record => record.displayTable !== false).map(record => libraryBase.GenerateColumns(record));

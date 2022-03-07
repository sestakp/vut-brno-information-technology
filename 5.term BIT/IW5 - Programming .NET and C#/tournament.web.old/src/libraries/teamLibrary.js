import * as libraryBase from "./libraryBase";

export const dataSettings = [
    {
        id: "name",
        header: "Name",
        type: libraryBase.dataSettingTypes.INPUT
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
        type: libraryBase.dataSettingTypes.IMAGE
    }
]

export const columns = dataSettings.filter(record => record.displayTable !== false).map(record => libraryBase.GenerateColumns(record));

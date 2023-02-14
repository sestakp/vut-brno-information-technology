import Rules from "./Rules";

export default interface DataSettingColumn{
    id: string,
    header: string,
    type: string,
    displayTable?: boolean,
    rules?: (getValues: (arg:string) => string) => Rules,
    optionDataProvider?: any,
    optionsId?: string,
    defaultSelectText?: string,
    selectDataProviderId?: string,
    selectDataProvider?: []
    groupById?: string,
    displayForm?: boolean,
    path?: string,
    suffix_id?: string,
    filter?: boolean,
    defaultValue?: string,
}
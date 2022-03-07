import DataSettingColumn from "./DataSettingColumn";

export default interface entityLibrary{
    dataSettings: DataSettingColumn[],
    columnsToForm: DataSettingColumn[],
    columnsToFilter: DataSettingColumn[],
    filter: (records: any[], filter:any) => any[],
    cardTableSetTitle?: (record:any) => string,
    cardTableSetDescription?: (record:any) => string,    
    cardTableSetFooter?: (record:any) => string,
}
import Model from "./Model";
import AxiosResponse from "./AxiosResponse";

export default interface baseClient<TModel>{
    getAll(params:object): Promise<AxiosResponse>,

    getById(payload:TModel): Promise<AxiosResponse>,

    create(payload:TModel): Promise<AxiosResponse>,

    update(payload:TModel): Promise<AxiosResponse>,    
    
    delete(payload:Model): Promise<AxiosResponse>,
    getFormDefaultModel(): Promise<AxiosResponse>,
}
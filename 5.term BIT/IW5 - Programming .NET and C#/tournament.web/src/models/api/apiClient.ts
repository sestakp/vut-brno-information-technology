export default interface apiClient<TModel>{
    get(url?: string, conf?: object):any
    delete(url: string, conf?: object):any
    head(url: string, conf?: object):any
    options(url: string, conf?: object):any
    post(url: string, data?: object, conf?: object):any
    put(url:string, data?: object, conf?: object):any
    patch(url:string, data?: object, conf?: object):any
}
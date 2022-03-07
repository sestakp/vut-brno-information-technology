import { TypeBase } from "./TypeBase";

export const Create = (payload) => ({
    type: TypeBase.CREATE,
    payload: payload,
})

export const Delete = (payload) => ({
    type: TypeBase.DELETE,
    payload: payload,
})

export const Update = (payload) => ({
    type: TypeBase.UPDATE,
    payload: payload,
})
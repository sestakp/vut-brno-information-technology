import pagingTypes from './pagingTypes';
import pagingEnum from './PagingEnum';

export const setIndex = () => {
    return {
        type: pagingTypes.SET_PAGE,
        payload: pagingEnum.INDEX
    }
}

export const setForm = () => {
    return{
        type: pagingTypes.SET_PAGE,
        payload: pagingEnum.FORM
    }
}

export const setDetail = () => {
    return{
        type: pagingTypes.SET_PAGE,
        payload: pagingEnum.DETAIL
    }
}

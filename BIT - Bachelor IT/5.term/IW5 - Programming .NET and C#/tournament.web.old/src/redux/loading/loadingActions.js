import loadingTypes from './loadingTypes';

export const setLoading = (bool) => {
    return {
        type: loadingTypes.SET_LOADING,
        payload: bool
    }
}

/**
 * Author: Lukáš Plevač
 */
const fetchParamSelector = {
    getParam: (state, param) => state.fetchParams[param],
    getFetchParams: (state) => state.fetchParams,
}

export default fetchParamSelector;
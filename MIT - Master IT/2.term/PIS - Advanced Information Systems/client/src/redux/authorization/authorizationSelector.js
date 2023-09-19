

const authorizationSelector = {
    
    getLogin: (state) => state.authorization.login,
    getUser: (state) => state.authorization.user,
}

export default authorizationSelector;
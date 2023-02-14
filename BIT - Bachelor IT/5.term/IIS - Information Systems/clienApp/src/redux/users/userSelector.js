/**
 * Author: Lukáš Plevač
 */
const userSelector = {
    getUser: (state) => state.user.user,
    getUsers: (state) => state.user.users,
}

export default userSelector;
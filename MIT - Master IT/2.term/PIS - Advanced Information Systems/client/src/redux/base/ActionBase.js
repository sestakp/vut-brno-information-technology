import { setNotification } from "../notifications/notificationActions";

function getBaseActions(types, client, name = "Record") {
    let baseActions = {
        setLoading: (loading) => {
            return {
                type: types.SET_LOADING,
                payload: loading,
            };
        },

        setErrors: (errors) => ({
            type: types.SET_ERRORS,
            payload: errors,
        }),

        GetById: (payload) => async (dispatch) => {
            try {
                dispatch(baseActions.setLoading(true));
                const response = await client.getById(payload);
                dispatch({
                    type: types.CREATE,
                    payload: response.data,
                });
            } catch (exception) {
                dispatch(
                    setNotification({
                        message: "Getting by id " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            } finally {
                dispatch(baseActions.setLoading(false));
            }
        },

        Create: (payload) => async (dispatch) => {
            try {
                //dispatch(setLoading(true));
                const response = await client.create(payload);

                if (response.data.errors === undefined) {
                    dispatch({
                        type: types.CREATE,
                        payload: response.data,
                    });
                    dispatch(
                        setNotification({
                            message: name + " created sucessfully",
                            status: "success",
                            show: true,
                        })
                    );
                } else {
                    console.error("validation error: ", response.data);
                    dispatch(baseActions.setErrors(response.data.errors));
                    dispatch(
                        setNotification({
                            message: "Validation error",
                            status: "error",
                            show: true,
                        })
                    );
                }
                return;
            } catch (exception) {
                dispatch(
                    setNotification({
                        message: "Creating " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            } finally {
                //dispatch(setLoading(true));
            }
        },

        Delete: (payload) => async (dispatch) => {
            try {
                const response = await client.delete(payload);
                dispatch({
                    type: types.DELETE,
                    payload: payload,
                });
                dispatch(
                    setNotification({
                        message: name + " deleted sucessfully",
                        status: "success",
                        show: true,
                    })
                );
            } catch (exception) {
                dispatch(
                    setNotification({
                        message: "Deleting " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            } finally {
            }
        },

        Update: (payload) => async (dispatch) => {
            try {
                const response = await client.update(payload);

                if (response.data.errors === undefined) {
                    dispatch({
                        type: types.UPDATE,
                        payload: response.data,
                    });
                    dispatch(
                        setNotification({
                            message: name + " updated sucessfully",
                            status: "success",
                            show: true,
                        })
                    );
                } else {
                    dispatch(
                        setNotification({
                            message: "Validation error",
                            status: "error",
                            show: true,
                        })
                    );
                }
            } catch (exception) {
                dispatch(
                    setNotification({
                        message: "Updating " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            } finally {
            }
        },

        GetAll: (fetchParams) => async (dispatch) => {
            try {
                //dispatch(loadingActions.setLoading(true));
                const response = await client.getAll(fetchParams);
                //TODO check status to 200
                dispatch({ type: types.GET_ALL, payload: response.data });
            } catch (FAILs) {
                dispatch({ type: types.GET_ALL, payload: [] });
                dispatch(
                    setNotification({
                        message: "Fetching " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            } finally {
                //dispatch(loadingActions.setLoading(false));
            }
        },

        SetFilter: (field, value) => {
            return {
                type: types.SET_FILTER,
                payload: { field: field, value: value },
            };
        },

        updateField: (id, fieldName, value) => async (dispatch) => {
            try {
                await client.updateField({ id, fieldName, value });
                dispatch({
                    type: types.UPDATE_FIELD,
                    payload: {
                        fieldName,
                        id,
                        value,
                    },
                });

                dispatch(
                    setNotification({
                        message: name + " updated sucessfully",
                        status: "success",
                        show: true,
                    })
                );


            } catch (FAILs) {
                console.error("fail: ", FAILs)
                dispatch(
                    setNotification({
                        message: "Update  " + name + " failed",
                        status: "error",
                        show: true,
                    })
                );
            }
        },
    };

    return baseActions;
}

export default getBaseActions;

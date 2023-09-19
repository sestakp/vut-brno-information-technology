import employeesClient from "../../api/employeesClient";
import authorizationActions from "../authorization/authorizationActions";
import getBaseActions from "../base/ActionBase";
import { setNotification } from "../notifications/notificationActions";
import employeesTypes from "./employeesTypes";

let employeesAction = getBaseActions(employeesTypes, employeesClient, "employees");

employeesAction.createNewEmployees = (newEmployees) => async (dispatch) => {
    let response = await employeesClient.create(newEmployees);
    if (response.status == 200) {
        dispatch({
            type: employeesTypes.RESET_NEW_EMPLOYEES_FIELD,
        });
        dispatch({
            type: employeesTypes.CREATE,
            payload: {
                ...newEmployees,
                id: response.data,
            },
        });
        dispatch(
            setNotification({
                message: "Employees created",
                status: "success",
                show: true,
            })
        );
    } else {
        dispatch(
            setNotification({
                message: "Employees wasn't created",
                status: "error",
                show: true,
            })
        );
    }
};


employeesAction.updateField = (id, fieldName, value) => async(dispatch) => {
    try {
        await employeesClient.updateField({ id, fieldName, value });
        dispatch({
            type: employeesTypes.UPDATE_FIELD,
            payload: {
                fieldName,
                id,
                value,
            },
        });
        dispatch(setNotification({
            message: "Employee profile updated",
            status: "success",
            show: true,
        }))
    } catch (FAILs) {
        dispatch(
            setNotification({
                message: "Update employee failed",
                status: "error",
                show: true,
            })
        );
    }
    dispatch(authorizationActions.updateUser(id, fieldName, value));
}


employeesAction.init = () => async(dispatch) => {
    try{
        var response = await employeesClient.init();

        if(response.data == 1){
            dispatch(
                setNotification({
                    message: "Data seeded succesfully",
                    status: "success",
                    show: true,
                })
            );
        }
        else{
            dispatch(
                setNotification({
                    message: "Data already seeded",
                    status: "info",
                    show: true,
                })
            );
        }

    }
    catch  (FAILs){
        dispatch(
            setNotification({
                message: "Error seeding data",
                status: "error",
                show: true,
            })
        );
    }
   
}

export default employeesAction;

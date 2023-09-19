import getBaseTypes from "../base/TypeBase";

let employeeTypes = getBaseTypes("EMPLOYEE");

employeeTypes.SET_EMPLOYEE = "SET_EMPLOYEE";
employeeTypes.SET_EMPLOYEES = "SET_EMPLOYEES";
employeeTypes.DEL_EMPLOYEE = "DEL_EMPLOYEE";
employeeTypes.SET_LOGIN_PARAM = "SET_LOGIN_PARAM";
employeeTypes.SET_REGISTRATION_PARAM = "SET_REGISTRATION_PARAM";
employeeTypes.UPDATE_EMPLOYEE_FIELD = "UPDATE_EMPLOYEE_FIELD";
employeeTypes.REMOVE_EMPLOYEE_RESERVATION = "REMOVE_EMPLOYEE_RESERVATION";
employeeTypes.RESET_NEW_EMPLOYEES_FIELD = "RESET_NEW_EMPLOYEES_FIELD";
employeeTypes.EMP_RESET = "EMP_RESET";

export default employeeTypes;

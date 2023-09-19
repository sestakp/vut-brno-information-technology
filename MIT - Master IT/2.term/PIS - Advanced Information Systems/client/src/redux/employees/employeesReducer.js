import ReducerBase from "../base/ReducerBase";
import employeeTypes from "./employeesTypes";

const INITIAL_STATE = {
    employee: {
        city: "",
        state: "",
        street: "",
        zipCode: "",
        bankAccount: "",
        id: -1,
        name: "",
        role: "",
        salary: -1,
        surname: "",
    },
    records: [],
    create: {
        city: "",
        state: "",
        street: "",
        zipCode: "",
        bankAccount: "",
        name: "",
        role: "",
        salary: -1,
        surname: "",
        password: "",
    },
};

const employeeReducer = (state = INITIAL_STATE, action) => {
    state = ReducerBase(state, action, employeeTypes);

    switch (action.type) {
        case employeeTypes.SET_EMPLOYEE:
            return { ...state, employee: action.payload };
        case employeeTypes.SET_EMPLOYEES:
            return { ...state, employees: action.payload };
        case employeeTypes.DEL_EMPLOYEE:
            return { ...state, employees: state.employees.filter((x) => x.id !== action.payload.id) };

        case employeeTypes.UPDATE_EMPLOYEE_FIELD:
            return { ...state, employee: { ...state.employee, [action.field]: action.payload } };

        case employeeTypes.EMP_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default employeeReducer;

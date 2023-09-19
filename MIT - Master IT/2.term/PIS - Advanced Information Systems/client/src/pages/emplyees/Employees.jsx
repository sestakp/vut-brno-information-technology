import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Container, MenuItem, Paper, Select, Tooltip, tooltipClasses } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { DataGrid, GridEditInputCell } from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import isAlpha from "validator/lib/isAlpha";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import isEmail from "validator/lib/isEmail";
import isPostalCode from "validator/lib/isPostalCode";
import employeesAction from "../../redux/employees/employeesActions";
import employeesSelector from "../../redux/employees/employeesSelector";
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import computeFieldName from "../../utils/employees/coputeFieldName";
import AddDialog from "./AddDialog";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "white",
        color: "red",
        border: "1px red solid  ",
        boxShadow: "3px 3px 7px #d98f8f, -3px -3px 7px #ffc1c1",
        fontWeight: "semiBold",
    },
}));

const Employees = (props) => {
    const noButtonRef = useRef(null);
    const [promiseArguments, setPromiseArguments] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);
    const [addDialog, setAddDialog] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        props.getEmployees();
    }, []);

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser])

    const processRowDelete = useCallback(async (id) => {
        await props.deleteEmployee(id);
        setDeleteRow(null);
    });

    const processRowUpdate = useCallback(
        (newRow, oldRow) =>
            new Promise((resolve, reject) => {
                const fieldName = computeFieldName(newRow, oldRow);
                if (fieldName) {
                    // Save the arguments to resolve or reject the promise later
                    setPromiseArguments({ resolve, reject, newRow, oldRow, fieldName });
                } else {
                    resolve(oldRow); // Nothing was changed
                }
            }),
        []
    );

    const handleNo = () => {
        const { oldRow, resolve } = promiseArguments;
        resolve(oldRow); // Resolve with the old row to not update the internal state
        setPromiseArguments(null);
    };

    const handleYes = async () => {
        const { newRow, oldRow, reject, resolve, fieldName } = promiseArguments;

        try {
            // Make the HTTP request to save in the backend
            await props.updateField(oldRow.id, fieldName, newRow[fieldName]);
            resolve(newRow);
            setPromiseArguments(null);
        } catch (error) {
            reject(oldRow);
            setPromiseArguments(null);
        }
    };

    const updateConfirmDialog = () => {
        if (!promiseArguments) {
            return null;
        }

        const { newRow, oldRow } = promiseArguments;
        const fieldName = computeFieldName(newRow, oldRow);

        return (
            <Dialog maxWidth="xs" open={!!promiseArguments}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>{`Pressing 'Yes' will change ${fieldName}.`}</DialogContent>
                <DialogActions>
                    <Button ref={noButtonRef} onClick={handleNo}>
                        No
                    </Button>
                    <Button onClick={handleYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    };
    const deleteConfirmDialog = () => {
        if (!deleteRow) {
            return null;
        }

        return (
            <Dialog maxWidth="xs" open={!!deleteRow}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>{`Pressing 'Yes' will delete row.`}</DialogContent>
                <DialogActions>
                    <Button ref={noButtonRef} onClick={() => setDeleteRow(null)}>
                        No
                    </Button>
                    <Button onClick={() => processRowDelete(deleteRow.id)}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    };

    function renderEdit(params) {
        const { error } = params;
        console.log(error);
        return (
            <LightTooltip placement="bottom-end" open={!!error} title={error}>
                <GridEditInputCell {...params} />
            </LightTooltip>
        );
    }

    const columns = [
        {
            field: "name",
            headerName: "First name",
            editable: true,
            sortable: true,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isAlpha(params.props.value);
                return { ...params.props, error: hasError ? "Wrong name" : "" };
            },
        },
        {
            field: "surname",
            headerName: "Surname",
            editable: true,
            sortable: true,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isAlpha(params.props.value);
                return { ...params.props, error: hasError ? "Wrong surname" : "" };
            },
        },
        {
            field: "email",
            headerName: "Email",
            editable: true,
            sortable: true,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isEmail(params.props.value);
                return { ...params.props, error: hasError ? "Wrong email" : "" };
            },
        },
        {
            field: "role",
            headerName: "Role",
            editable: true,
            sortable: false,
            renderEditCell: renderEdit,
            renderCell: (params) => {
                if (params.hasFocus)
                    return (
                        <Select onChange={(event) => processRowUpdate({ ...params.row, role: event.target.value }, params.row)} defaultValue={params.row.role}>
                            <MenuItem value="RECEPTIONIST">Receptionist</MenuItem>
                            <MenuItem value="CLEANER">Cleaner</MenuItem>
                            <MenuItem value="COOK">Cook</MenuItem>
                            <MenuItem value="MANAGER">Manager</MenuItem>
                        </Select>
                    );
                return <>{params.row.role}</>;
            },
        },
        {
            field: "salary",
            headerName: "Salary",
            type: "number",
            editable: true,
            sortable: true,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = Number(params.props.value) <= 0;
                return { ...params.props, error: hasError ? "Wrong salary" : "" };
            },
        },
        {
            field: "bankAccount",
            headerName: "Bank Account",
            editable: true,
            sortable: false,
            width: 200,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const regex = /^\d{1,10}\/\d{4}$/;
                const hasError = !regex.test(params.props.value);
                return { ...params.props, error: hasError ? "Wrong bank account" : "" };
            },
        },
        {
            field: "city",
            headerName: "City",
            editable: true,
            sortable: false,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isAlpha(params.props.value);
                return { ...params.props, error: hasError ? "Wrong city" : "" };
            },
        },
        {
            field: "state",
            headerName: "State",
            editable: true,
            sortable: false,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isAlpha(params.props.value);
                return { ...params.props, error: hasError ? "Wrong state" : "" };
            },
        },
        {
            field: "street",
            headerName: "Street",
            editable: true,
            sortable: false,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isAlphanumeric(params.props.value);
                return { ...params.props, error: hasError ? "Wrong street" : "" };
            },
        },
        {
            field: "zipCode",
            headerName: "Zip Code",
            editable: true,
            sortable: false,
            renderEditCell: renderEdit,
            preProcessEditCellProps: (params) => {
                const hasError = !isPostalCode(params.props.value, "CZ");
                return { ...params.props, error: hasError ? "Wrong zip code" : "" };
            },
        },
        {
            headerName: "Delete",
            width: 80,
            cellClassName: "actions",
            editable: false,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button onClick={() => setDeleteRow(params.row)}>
                    <DeleteIcon color="inherit" />
                </Button>
            ),
        },
    ];

    return (
        <Container>
            <Paper elevation={5}>
                <h1>Employee panel</h1>
                <div style={{ height: "80vh", width: "100%" }}>
                    {updateConfirmDialog()}
                    {deleteConfirmDialog()}
                    <DataGrid disableRowSelectionOnClick rows={props.employees} columns={columns} processRowUpdate={processRowUpdate} />
                    <AddDialog show={addDialog} onClose={() => setAddDialog(null)} onCreate={props.createEmployee}></AddDialog>
                    <AddIcon onClick={() => setAddDialog(true)} className="addIcon" />
                </div>
            </Paper>
        </Container>
    );
};
const mapStateToProps = (state, ownProps) => ({
    employees: employeesSelector.getAll(state),    
    currentUser: authorizationSelector.getUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getEmployees: () => dispatch(employeesAction.GetAll()),
    updateField: (id, fieldName, newValue) => dispatch(employeesAction.updateField(id, fieldName, newValue)),
    deleteEmployee: (id) => dispatch(employeesAction.Delete(id)),
    createEmployee: (employee) => dispatch(employeesAction.createNewEmployees(employee)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Employees);

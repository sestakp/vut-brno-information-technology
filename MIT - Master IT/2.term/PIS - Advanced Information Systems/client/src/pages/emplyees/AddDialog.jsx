import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Grid, MenuItem, Select, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import generatePassword from "../../utils/employees/passwordGenerator";
import "./Employees.css";

const PASSWORD_LEN = 10;

const AddDialog = (props) => {
    const [role, setRole] = useState("client");
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [email, setEmail] = useState(null);
    const [salary, setSalary] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    const [street, setStreet] = useState(null);
    const [zipCode, setZipCode] = useState(null);
    const [password, setPassword] = useState(generatePassword(PASSWORD_LEN));

    const closeForm = () => {
        setRole("client");
        setName(null);
        setSurname(null);
        setEmail(null);
        setSalary(null);
        setBankAccount(null);
        setCity(null);
        setState(null);
        setStreet(null);
        setZipCode(null);
        props.onClose();
        setPassword(generatePassword(PASSWORD_LEN));
    };

    const saveForm = () => {
        props.onCreate({
            name,
            surname,
            role,
            salary,
            email,
            bankAccount,
            city,
            state,
            street,
            zipCode,
            password,
        });
        closeForm();
    };

    if (props.show) {
        return (
            <Dialog open={!!props.show}>
                <DialogTitle>Create new Employee</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <div>
                                <TextField
                                    margin="small"
                                    fullWidth
                                    label="Name"
                                    onChange={(event) => setName(event.target.value)}
                                    value={name}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Surname"
                                onChange={(event) => setSurname(event.target.value)}
                                value={surname}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Email"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                style={{ width: "100%" }}
                                onChange={(event) => setRole(event.target.value)}
                                value={role}
                            >
                                <MenuItem value="receptionist">Receptionist</MenuItem>
                                <MenuItem value="cleaner">Cleaner</MenuItem>
                                <MenuItem value="cook">Cook</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                            </Select>
                        </Grid>
                        
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Salary"
                                onChange={(event) => setSalary(event.target.value)}
                                value={salary}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Bank Account"
                                onChange={(event) => setBankAccount(event.target.value)}
                                value={bankAccount}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="City"
                                onChange={(event) => setCity(event.target.value)}
                                value={city}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="State"
                                onChange={(event) => setState(event.target.value)}
                                value={state}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Street"
                                onChange={(event) => setStreet(event.target.value)}
                                value={street}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="small"
                                fullWidth
                                label="Zip Code"
                                onChange={(event) => setZipCode(event.target.value)}
                                value={zipCode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className="refreshIcon">
                                <ContentCopyIcon onClick={() => navigator.clipboard.writeText(password)} />
                                <CachedIcon onClick={() => setPassword(generatePassword(PASSWORD_LEN))} />
                            </div>
                            <div style={{ width: "100%", position: "relative" }}>
                                <TextField
                                    margin="small"
                                    fullWidth
                                    label="Password"
                                    disabled
                                    style={{ position: "absolute" }}
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm}>No</Button>
                    <Button onClick={saveForm}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return <></>;
};

export default AddDialog;

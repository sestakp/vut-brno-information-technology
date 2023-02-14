/**
 * Author: Vojtěch Kulíšek
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userClient from "../../api/userClient";
import { setNotification } from "../../redux/notifications/notificationActions";
import userActions from "../../redux/users/userActions";
import userSelector from "../../redux/users/userSelector";
import ButtonForm from "../ButtonForm/ButtonForm";
import InputForm from "../InputForm/InputForm";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditableCellDefault from './EditableCell/Default/EditableCellDefault';
import EditableCellRole from "./EditableCell/Select/EditableCellRole";
import DeleteIcon from '@mui/icons-material/Delete';
import { connect } from "react-redux";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
 
const UserTable = (props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (props.user.role === "admin") {
      props.getUsers();
    }
  }, [props.user.role]);

  if (props.user.role !== "admin") {
    return "";
  }

  return (
    <div className="mt-5 space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <DeleteDialog 
        open={deleteDialogOpen}
        handleDisagree={() => setDeleteDialogOpen(false) }
        handleAgree={() => { props.deleteUser(user); setDeleteDialogOpen(false); }}
        user={user}
      />
      <section>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 sm:p-6 text-neutral-900 dark:text-neutral-200">
            <div>
              <h2 className="text-lg font-medium leading-6">System Users</h2>
            </div>
            <div>
              <MaUTable>
                <TableHead>
                    <TableRow>
                        <TableCell>
                          Name
                        </TableCell>
                        <TableCell>
                          Email
                        </TableCell>
                        <TableCell>
                          Role
                        </TableCell>
                        <TableCell>
                          Delete
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {props.users.map((user) => {
                    return (
                      <TableRow key={user.id}>
                            <EditableCellDefault user={user} name="name" />
                            <EditableCellDefault user={user} name="email" />
                            <EditableCellRole user={user} name="role" options={["admin", "user"]} />
                            <TableCell>
                              <DeleteIcon style={{cursor: "pointer"}} onClick={() => {setDeleteDialogOpen(true); setUser(user);}/*props.deleteUser(user)*/}/>
                            </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </MaUTable>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


const mapStateToProps = (state, ownProps) => ({
  user: userSelector.getUser(state),
  users: userSelector.getUsers(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    deleteUser: (user) => dispatch(userActions.deleteUser(user)),
    getUsers: () => dispatch(userActions.getAllUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);

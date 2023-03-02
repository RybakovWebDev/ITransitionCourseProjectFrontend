import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React from "react";
import { Button, Form } from "react-bootstrap";

const RenderUsersTable = (propsTable) => {
  const { u, i, props } = propsTable;

  return (
    <React.Fragment>
      <TableRow className='users-table-element'>
        <TableCell>
          {props.user._id !== u._id && (
            <Form.Check
              aria-label='option 1'
              id={u._id}
              checked={props.checkedUsers.includes(u._id)}
              onChange={props.checkUserHandler}
            />
          )}
        </TableCell>
        <TableCell>{i + 1}</TableCell>
        <TableCell>{u.name}</TableCell>
        <TableCell>{u.email}</TableCell>
        <TableCell>
          {props.user._id !== u._id && (
            <FormControlLabel
              control={<Switch id='usersUpdateAdminBtn' checked={u.admin} onChange={(e) => props.usersHandler(e, u)} />}
              labelPlacement='top'
              label={u.admin ? "Admin" : "User"}
            />
          )}
        </TableCell>
        <TableCell>
          {props.user._id !== u._id && (
            <FormControlLabel
              control={
                <Switch id='usersUpdateStatusBtn' checked={u.status} onChange={(e) => props.usersHandler(e, u)} />
              }
              labelPlacement='top'
              label={u.status ? "Active" : "Blocked"}
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ borderBottom: i !== props.users.length - 1 && "1px solid lightgrey" }}
          colSpan={6}
        ></TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const Users = (props) => {
  const users = [props.user].concat(props.users.filter((u) => u._id !== props.user._id));

  return (
    <article className='users-parent'>
      <div className='users-table-cont'>
        <div className='users-table-wrapper'>
          {" "}
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>
                  <Form.Check
                    aria-label='option 1'
                    checked={props.checkedAllUsers}
                    onChange={props.checkAllUsersHandler}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>#</TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>User name</TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>User email</TableCell>

                <TableCell className='items-table-column-tags' style={{ borderBottom: "1px solid lightgrey" }}>
                  Admin
                </TableCell>
                <TableCell className='items-table-column-tags' style={{ borderBottom: "1px solid lightgrey" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, i) => (
                <RenderUsersTable key={u._id} u={u} i={i} props={props} />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='users-table-controls-cont'>
          {props.checkedUsers.length > 0 ? (
            <div>
              <Button
                id='usersTableControlsRemove'
                className='users-table-controls-btn'
                variant='btn btn-outline-dark'
                onClick={props.deleteDialogUsersHandler}
              >
                Delete selected accounts
              </Button>
            </div>
          ) : (
            ""
          )}
          <Dialog
            open={props.deleteDialogUsers}
            onClose={props.deleteDialogUsersHandler}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth={true}
            maxWidth='xs'
          >
            <DialogTitle id='alert-dialog-title'>{"Are you sure?"}</DialogTitle>
            <DialogActions>
              <Button variant='btn btn-outline-primary' onClick={props.deleteDialogUsersHandler}>
                Cancel
              </Button>{" "}
              <Button
                // value={i}
                id='userRemoveBtn'
                variant='btn btn-outline-danger'
                onClick={(e) => props.usersHandler(e)}
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </article>
  );
};

export default Users;

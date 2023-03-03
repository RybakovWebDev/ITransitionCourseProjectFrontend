import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { alpha } from "@mui/material/styles";

const lang = localStorage.getItem("language");

const RenderUsersTable = (propsTable) => {
  const { u, i, isSelected, checkUserHandler, props } = propsTable;
  const isUserSelected = isSelected(u._id);
  const labelId = `enhanced-table-checkbox-${i}`;

  return (
    <React.Fragment>
      <TableRow className='users-table-element'>
        <TableCell>
          {props.user._id !== u._id && (
            <Checkbox
              color='primary'
              checked={isUserSelected}
              inputProps={{
                "aria-labelledby": labelId,
              }}
              onClick={(e) => checkUserHandler(e, u._id)}
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
              label={u.admin ? (lang === "eng" ? "Admin" : "Администратор") : lang === "eng" ? "User" : "Пользователь"}
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
              label={u.status ? (lang === "eng" ? "Active" : "Активен") : lang === "eng" ? "Blocked" : "Заблокирован"}
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

function EnhancedTableToolbar(props) {
  const { numChecked } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numChecked > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numChecked > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color='inherit' variant='subtitle1' component='div'>
          {numChecked} {lang === "eng" ? "selected" : "выбрано"}
        </Typography>
      ) : (
        ""
      )}
    </Toolbar>
  );
}

const Users = (props) => {
  const users = [props.user].concat(props.users.filter((u) => u._id !== props.user._id));
  const checkedUsers = props.checkedUsers;
  const checkAllUsersHandler = props.checkAllUsersHandler;
  const isSelected = (id) => checkedUsers.indexOf(id) !== -1;
  const numChecked = checkedUsers.length;
  const rowCount = users.length - 1;

  return (
    <article className='users-parent'>
      <div className='users-table-cont'>
        <div className='users-table-wrapper'>
          {" "}
          <Table
            size='small'
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>
                  <Checkbox
                    color='primary'
                    indeterminate={numChecked > 0 && numChecked < rowCount}
                    checked={rowCount > 0 && numChecked === rowCount}
                    onChange={checkAllUsersHandler}
                    inputProps={{
                      "aria-label": "select all items",
                    }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>#</TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>{lang === "eng" ? "Name" : "Имя"}</TableCell>
                <TableCell style={{ borderBottom: "1px solid lightgrey" }}>
                  {lang === "eng" ? "Email" : "Почта"}
                </TableCell>

                <TableCell className='items-table-column-tags' style={{ borderBottom: "1px solid lightgrey" }}>
                  {lang === "eng" ? "Admin status" : "Статус администратора"}
                </TableCell>
                <TableCell className='items-table-column-tags' style={{ borderBottom: "1px solid lightgrey" }}>
                  {lang === "eng" ? "Ban status" : "Статус блокировки"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, i) => (
                <RenderUsersTable
                  isSelected={isSelected}
                  checkUserHandler={props.checkUserHandler}
                  key={u._id}
                  u={u}
                  i={i}
                  props={props}
                />
              ))}
            </TableBody>
          </Table>
          <EnhancedTableToolbar numChecked={numChecked} />
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
                {lang === "eng" ? "Delete selected accounts" : "Удалить выбранных пользователей"}
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
                {lang === "eng" ? "Cancel" : "Отмена"}
              </Button>{" "}
              <Button id='userRemoveBtn' variant='btn btn-outline-danger' onClick={(e) => props.usersHandler(e)}>
                {lang === "eng" ? "Delete" : "Удалить"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </article>
  );
};

export default Users;

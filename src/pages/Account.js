import { Typography } from "@mui/material";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Collections from "../components/Collections";
import Users from "../components/Users";

const Account = (props) => {
  return (
    <article className='account-parent'>
      <Typography ml={"15%"} mt={"1rem"} mb={"1rem"} variant='h4'>
        Personal collections
      </Typography>
      <Collections
        user={props.user}
        users={props.users}
        collections={props.collections}
        addingCollection={props.addingCollection}
        collectionsModalVisibility={props.collectionsModalVisibility}
        collectionsModalHandler={props.collectionsModalHandler}
        collectionsHandler={props.collectionsHandler}
        activeCollection={props.activeCollection}
        setActiveCollection={props.setActiveSelectedCollection}
        openCollectionHandler={props.openCollectionHandler}
        deleteDialog={props.deleteDialog}
        deleteDialogHandler={props.deleteDialogHandler}
        // editCustomField={props.editCustomField}
        collectionsCFError={props.collectionsCFError}
        collectionsCategoryHandler={props.collectionsCategoryHandler}
      />
      {props.user.admin && (
        <div>
          <Typography ml={"15%"} mt={"2rem"} mb={"1rem"} variant='h4'>
            Admin controls
          </Typography>

          <Users
            user={props.user}
            users={props.users}
            usersHandler={props.usersHandler}
            checkAllUsersHandler={props.checkAllUsersHandler}
            checkUserHandler={props.checkUserHandler}
            checkedAllUsers={props.checkedAllUsers}
            checkedUsers={props.checkedUsers}
            deleteDialogUsers={props.deleteDialogUsers}
            deleteDialogUsersHandler={props.deleteDialogUsersHandler}
          />
        </div>
      )}
    </article>
  );
};

export default Account;

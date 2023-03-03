import { Typography } from "@mui/material";
import Collections from "../components/Collections";
import Users from "../components/Users";

const lang = localStorage.getItem("language");

const Account = (props) => {
  return (
    <article className='account-parent'>
      <Typography ml={"15%"} mt={"1rem"} mb={"1rem"} variant='h4'>
        {lang === "eng" ? "Personal collections" : "Личные коллекции"}
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
        collectionsCFError={props.collectionsCFError}
        collectionsCategoryHandler={props.collectionsCategoryHandler}
      />
      {props.user.admin && (
        <div>
          <Typography ml={"15%"} mt={"2rem"} mb={"1rem"} variant='h4'>
            {lang === "eng" ? "Admin controls" : "Администрирование"}
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

import "./App.css";
import { useEffect, useState } from "react";
import { useUsersContext } from "./hooks/useUsersContext";
import { useCollectionsContext } from "./hooks/useCollectionsContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Home from "./pages/Home";
import RegistrationForm from "./pages/RegistrationForm";
import LoginForm from "./pages/LoginForm";
import HeaderMenu from "./components/HeaderMenu";
import Account from "./pages/Account";
import Items from "./pages/Items";
import dayjs from "dayjs";
import { useAuthContext } from "./hooks/useAuthContext";
import { useItemsContext } from "./hooks/useItemsContext";
import Search from "./pages/Search";
import { CircularProgress, Link, Switch, Typography } from "@mui/material";
import { useLogout } from "./hooks/useLogout";
import { deleteUser, getUsers, patchUser } from "./modules/userCRUD";
import { deleteCollection, getCollections, patchCollection, postCollection } from "./modules/collectionCRUD";
import { deleteItem, getItems, patchItem, postItem } from "./modules/itemCRUD";

function camelize(str) {
  return str
    .trim()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

const lang = localStorage.getItem("language") || "eng";

function App() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { users, dispatchUsers } = useUsersContext();
  const { collections, dispatchCollections } = useCollectionsContext();
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [deleteDialogUsers, setDeleteDialogUsers] = useState(false);
  // Collections
  const [activeCollection, setActiveCollection] = useState([]);
  const [addingCollection, setAddingCollection] = useState(false);
  const [copyCollection, setCopyCollection] = useState();
  const [collectionsCFError, setCollectionsCFError] = useState("");
  const [collectionsModalVisibility, setCollectionsModalVisibility] = useState(false);
  const [deleteDialogCollections, setDeleteDialogCollections] = useState(false);
  // Items
  const { items, dispatchItems } = useItemsContext();
  const [addingItem, setAddingItem] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedAllItems, setCheckedAllItems] = useState(false);
  const [deleteDialogItems, setDeleteDialogItems] = useState(false);
  const [deleteDialogComments, setDeleteDialogComments] = useState(false);
  const [itemsModalVisibility, setItemsModalVisibility] = useState(false);
  const [itemToAdd, setItemToAdd] = useState({});
  const [itemComment, setItemComment] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState();
  // Search
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const tags = [];

  const navigate = useNavigate();

  const testThenLogout = () => {
    getUsers(dispatchUsers);
    if (user && users && !users.filter((u) => u._id === user._id)[0]) {
      logout();
      navigate("/");
      return;
    }
    if (user && users && !users.filter((u) => u._id === user._id)[0].status) {
      logout();
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_URI}/api/users`);
      const json = await response.json();
      if (response.ok) {
        dispatchUsers({ type: "SET_USERS", payload: json });
      }
    };
    fetchUsers();
  }, [dispatchUsers]);

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch(`${process.env.REACT_APP_URI}/api/collections`);
      const json = await response.json();
      if (response.ok) {
        dispatchCollections({ type: "SET_COLLECTIONS", payload: json });
      }
    };
    fetchCollections();
  }, [dispatchCollections]);

  const usersHandler = (e, input) => {
    testThenLogout();
    const id = e.currentTarget?.id;
    if (id === "usersUpdateAdminBtn") {
      const userUpdate = JSON.parse(JSON.stringify(input));
      userUpdate.admin = !userUpdate.admin;
      patchUser(userUpdate, dispatchUsers);
    }
    if (id === "usersUpdateStatusBtn") {
      const userUpdate = JSON.parse(JSON.stringify(input));
      userUpdate.status = !userUpdate.status;
      patchUser(userUpdate, dispatchUsers);
    }
    if (id === "dialogDeleteConfirmationBtn" && items) {
      checkedUsers.map((id) => deleteUser(id, dispatchUsers, items, dispatchItems, collections, dispatchCollections));
      setCheckedUsers([]);
      getUsers(dispatchUsers);
      deleteDialogUsersHandler();
    }
  };

  const checkAllUsersHandler = (e) => {
    getItems(dispatchItems, tags, setTagSuggestions);
    if (e.target.checked) {
      const newSelected = users.filter((u) => u._id !== user._id).map((u) => u._id);
      setCheckedUsers(newSelected);
      return;
    }
    setCheckedUsers([]);
  };

  const checkUserHandler = (e, id) => {
    getItems(dispatchItems, tags, setTagSuggestions);
    const selectedIndex = checkedUsers.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(checkedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(checkedUsers.slice(1));
    } else if (selectedIndex === checkedUsers.length - 1) {
      newSelected = newSelected.concat(checkedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(checkedUsers.slice(0, selectedIndex), checkedUsers.slice(selectedIndex + 1));
    }

    setCheckedUsers(newSelected);
  };

  const deleteDialogUsersHandler = () => {
    deleteDialogUsers ? setDeleteDialogUsers(false) : setDeleteDialogUsers(true);
  };

  ///////////////////

  const collectionsHandler = (e, input, option) => {
    testThenLogout();
    const id = e.currentTarget?.id;
    const value = e.currentTarget?.value;

    if (id === "collectionModalName") setActiveCollection({ ...activeCollection, name: value });
    if (e.value) {
      setActiveCollection({ ...activeCollection, category: e.value });
    }
    if (id === "collectionModalDescription") setActiveCollection({ ...activeCollection, description: value });
    if (input === false) {
      setActiveCollection({});
    }
    if (e === "imageUrl") {
      setActiveCollection({ ...activeCollection, image: input });
    }
    if (id === "collectionModalRemoveImageBtn") {
      setActiveCollection({ ...activeCollection, image: "" });
    }
    if (e === "collectionModalCustomFieldRemoveBtn") {
      setDeleteDialogCollections(false);
      setActiveCollection((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.customFields.splice(value, 1);
        return copy;
      });
    }
    if (id && id.split(",")[0] === "collectionModalCustomFieldName") {
      const changeIndex = id.split(",")[1];
      value ? setCollectionsCFError("") : setCollectionsCFError("Can't be empty");
      setActiveCollection((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.customFields[changeIndex].splice(1, 1, value);
        return copy;
      });
    }

    if (id && id.split("-")[0] === "collectionsModalCustomFieldType") {
      let newValue;
      if (input === "Short text message") newValue = "input";
      if (input === "Long text message") newValue = "textarea";
      if (input === "Number") newValue = "number";
      if (input === "Checkbox") newValue = "boolean";
      if (input === "Date") newValue = "date";
      setActiveCollection((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.customFields[option].splice(0, 1, newValue);
        return copy;
      });
    }

    if (id && id.split("-")[0] === "collectionsModalFieldAdd") {
      let fieldType;
      if (id.split("-")[1] === "InputBtn") fieldType = "input";
      if (id.split("-")[1] === "TextareaBtn") fieldType = "textarea";
      if (id.split("-")[1] === "NumberBtn") fieldType = "number";
      if (id.split("-")[1] === "BooleanBtn") fieldType = "boolean";
      if (id.split("-")[1] === "DateBtn") fieldType = "date";
      setActiveCollection((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.customFields.push([fieldType, lang === "eng" ? "New custom field" : "Новое дополнительное поле"]);
        return copy;
      });
    }

    if (id === "collectionModalCancelBtn") {
      setAddingCollection(false);
      setTimeout(() => setActiveCollection(copyCollection), 300);
      collectionsModalHandler();
    }
    if (id === "collectionModalSaveBtn") {
      patchCollection(activeCollection, dispatchCollections);
      setCollectionsModalVisibility(false);
    }
    if (id === "collectionModalAddBtn") {
      setActiveCollection({
        ...activeCollection,
        _id: uuidv4(),
        author: user._id,
        customFields: activeCollection.customFields ? activeCollection.customFields : [],
      });
      postCollection(activeCollection, user, dispatchCollections);
      setCollectionsModalVisibility(false);
      setAddingCollection(false);
    }

    if (id === "collectionsListItemOpenBtn") {
      openCollectionHandler(input);
    }
    if (id === "collectionsListItemEditBtn") {
      setActiveCollection(input);
      collectionsModalHandler();
    }
    if (id === "collectionsListItemDeleteBtn") {
      setActiveCollection(input);
      deleteDialogCollectionsHandler();
    }
    if (id === "dialogDeleteConfirmationBtn") {
      deleteCollection(activeCollection._id, dispatchCollections);
      deleteDialogCollectionsHandler();
    }
    if (id === "collectionsListControlsAdd") {
      setActiveCollection({ customFields: [] });
      setAddingCollection(true);
      collectionsModalHandler();
    }
  };

  const collectionsCategoryHandler = (e) => {
    setActiveCollection({ ...activeCollection, category: e.target.value });
  };

  const collectionsModalHandler = () => {
    const copy = JSON.parse(JSON.stringify(activeCollection));
    setCopyCollection(copy);

    collectionsModalVisibility ? setCollectionsModalVisibility(false) : setCollectionsModalVisibility(true);
  };

  const openCollectionHandler = (id) => {
    setSearchInput("");
    setSearchQuery("");
    setActiveCollection(collections.filter((c) => c._id === id)[0]);
    getItems(dispatchItems, tags, setTagSuggestions);
  };

  /////////////////////////

  const itemsHandler = (e, i, reason) => {
    testThenLogout();
    const id = e?.currentTarget?.id || "";
    const value = e?.currentTarget?.value || "";
    const customField = id.split(",");
    const itemUpdate = JSON.parse(JSON.stringify(itemToAdd));

    itemUpdate._id = itemToAdd._id || uuidv4();
    itemUpdate.collectionID = activeCollection._id;
    itemUpdate.author = activeCollection.author;
    itemUpdate.likes = itemToAdd.likes || [];
    itemUpdate.comments = itemToAdd.comments || [];
    itemUpdate.customFields = itemToAdd.customFields || {};
    itemUpdate.tags = itemToAdd.tags || [];

    if (id === "itemModalName") itemUpdate.name = value;
    if (reason === "clear") itemUpdate.tags = [];
    if (reason === "selectOption" || reason === "removeOption" || reason === "createOption") itemUpdate.tags = i;
    if (customField[0] === "input" || customField[0] === "number")
      itemUpdate.customFields[camelize(customField[1])] = value;
    if (customField[0] === "textarea") {
      itemUpdate.customFields[camelize(customField[1])] = value;
    }
    if (customField[0] === "boolean") itemUpdate.customFields[camelize(customField[1])] = e.currentTarget.checked;
    if (!e.target && e.split(",")[0] === "date") {
      const fieldData = e.split(",")[1];
      itemUpdate.customFields[camelize(fieldData)] = dayjs(i).format("YYYY-MM-DD");
    }

    setItemToAdd(itemUpdate);

    if (i === "itemTag" && e.target.id !== "itemCheckboxesTags") {
      const tagValue = e.target.innerHTML;
      setSearchQuery(tagValue);
      searchItems(tagValue);
      navigate("/search");
    }

    if (id === "itemsTableControlsAdd") {
      setAddingItem(true);
      itemsModalHandler();
    }
    if (id === "dialogDeleteConfirmationBtn") {
      checkedItems.map((el) => deleteItem(el, dispatchItems, tags, setTagSuggestions));
      setCheckedItems([]);
      setCheckedAllItems(false);
      deleteDialogItemsHandler();
    }
    if (id === "itemsTableItemCollapseControlsOpenCollectionBtn") {
      openCollectionHandler(i);
    }
    if (id === "itemsTableItemCollapseControlsLikeBtn") {
      const newItem = JSON.parse(JSON.stringify(i));
      const targetIndex = newItem.likes.indexOf(user._id);
      newItem.likes.includes(user._id) ? newItem.likes.splice(targetIndex, 1) : newItem.likes.push(user._id);
      patchItem(newItem, dispatchItems, searchQuery, searchItems, tags, setTagSuggestions);
      setItemToAdd({});
    }
    if (id === "itemsTableItemCollapseControlsEditBtn") {
      const match = items.filter((item) => item._id === i);
      itemsModalHandler();
      setItemToAdd(match[0]);
    }
    if (id === "itemModalCancelBtn") {
      itemsModalHandler();
      setAddingItem(false);
      setTimeout(() => setItemToAdd({}), 300);
    }
    if (id === "itemModalSaveBtn") {
      patchItem(itemUpdate, dispatchItems, searchQuery, searchItems, tags, setTagSuggestions);
      itemsModalHandler();
      setTimeout(() => setItemToAdd({}), 300);
    }
    if (id === "itemModalAddBtn") {
      postItem(itemToAdd, dispatchItems, tags, setTagSuggestions);
      itemsModalHandler();
      setTimeout(() => setItemToAdd({}), 300);
      setAddingItem(false);
    }
  };

  const itemCommentHandler = (e, itemID, comment) => {
    testThenLogout();
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    const newItem = items.filter((i) => i._id === itemID)[0];
    if (id === "itemNewCommentField") setItemComment(value);
    if (id === "itemsTableItemCollapseControlsAddComment") {
      newItem.comments.push({ _id: uuidv4(), author: user._id, text: itemComment });
      patchItem(newItem, dispatchItems, searchQuery, searchItems, tags, setTagSuggestions);
      setItemComment("");
    }
    if (id === "itemCommentRemoveBtn") {
      const targetIndex = newItem.comments.indexOf(comment);
      newItem.comments.splice(targetIndex, 1);
      patchItem(newItem, dispatchItems, searchQuery, searchItems, tags, setTagSuggestions);
      deleteDialogCommentsHandler();
    }
  };

  const itemsModalHandler = () => {
    if (itemsModalVisibility) {
      setAddingItem(false);
      setTimeout(() => setItemToAdd({}), 300);
    }
    itemsModalVisibility ? setItemsModalVisibility(false) : setItemsModalVisibility(true);
  };

  const checkAllItemsHandler = (e) => {
    if (e.target.checked) {
      const newSelected = items.filter((i) => i.collectionID === activeCollection._id).map((i) => i._id);
      setCheckedItems(newSelected);
      return;
    }
    setCheckedItems([]);
  };

  const checkItemHandler = (e, id) => {
    const selectedIndex = checkedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(checkedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(checkedItems.slice(1));
    } else if (selectedIndex === checkedItems.length - 1) {
      newSelected = newSelected.concat(checkedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(checkedItems.slice(0, selectedIndex), checkedItems.slice(selectedIndex + 1));
    }

    setCheckedItems(newSelected);
  };

  //////////////////////

  const searchHandler = (e) => {
    testThenLogout();
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === "searchInput") {
      setSearchInput(value);
    }
    if (id === "searchBtn") {
      setSearchQuery(searchInput);
      if (typeof searchInput === "string" && searchInput) searchItems(searchInput);
    }
  };

  const searchItems = async (input) => {
    const searchObj = { searchQuery: input };
    const response = await fetch(`${process.env.REACT_APP_URI}/api/items/search`, {
      method: "POST",
      body: JSON.stringify(searchObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatchItems({ type: "SET_ITEMS", payload: json });
      setSearchResults(json);
      setSearchInput("");
    }
  };

  const getTagData = () => {
    let allTags;
    let count = {};
    let finalData = [];
    if (items && items.length !== 0) {
      allTags = items
        .map((i) => i.tags)
        .reduce((pre, cur) => {
          return pre.concat(cur);
        });

      allTags.forEach((x) => {
        count[x] = (count[x] || 0) + 1;
      });
      Object.entries(count).map((el) => finalData.push({ value: el[0], count: el[1] }));
    }
    return finalData.slice(-15);
  };

  const tagCloudHandler = (tag) => {
    testThenLogout();
    setSearchQuery(tag.value);
    searchItems(tag.value);
    navigate("/search");
  };

  const deleteDialogItemsHandler = () => {
    deleteDialogItems ? setDeleteDialogItems(false) : setDeleteDialogItems(true);
  };

  const deleteDialogCommentsHandler = () => {
    deleteDialogComments ? setDeleteDialogComments(false) : setDeleteDialogComments(true);
  };

  const deleteDialogCollectionsHandler = (e) => {
    deleteDialogCollections ? setDeleteDialogCollections(false) : setDeleteDialogCollections(true);
  };

  const languageHandler = () => {
    testThenLogout();
    if (!localStorage.getItem("language")) localStorage.setItem("language", "eng");
    const newLang = localStorage.getItem("language") === "eng" ? "rus" : "eng";
    localStorage.setItem("language", newLang);
    window.location.reload();
  };

  return (
    <section className='app-parent'>
      <header className='app-header-parent'>
        <HeaderMenu user={user} searchHandler={searchHandler} searchInput={searchInput} />
      </header>
      <section className='app-body-parent'>
        <Routes>
          <Route
            path='/'
            element={
              collections && users ? (
                <Home
                  user={user}
                  users={users}
                  getCollections={getCollections(dispatchCollections)}
                  getItems={() => getItems(dispatchItems, tags, setTagSuggestions)}
                  collections={collections}
                  addingCollection={addingCollection}
                  collectionsHandler={collectionsHandler}
                  collectionsModalVisibility={collectionsModalVisibility}
                  collectionsModalHandler={collectionsModalHandler}
                  activeCollection={activeCollection}
                  setActiveCollection={setActiveCollection}
                  openCollectionHandler={openCollectionHandler}
                  deleteDialog={deleteDialogCollections}
                  deleteDialogCollectionsHandler={deleteDialogCollectionsHandler}
                  collectionsCFError={collectionsCFError}
                  collectionsCategoryHandler={collectionsCategoryHandler}
                  searchQuery={searchQuery}
                  setSearchInput={setSearchInput}
                  setSearchQuery={setSearchQuery}
                  items={items}
                  activeItems={items}
                  addingItem={addingItem}
                  tagSuggestions={tagSuggestions}
                  checkAllItemsHandler={checkAllItemsHandler}
                  checkItemHandler={checkItemHandler}
                  checkedAllItems={checkedAllItems}
                  checkedItems={checkedItems}
                  itemsModalVisibility={itemsModalVisibility}
                  itemsModalHandler={itemsModalHandler}
                  itemsHandler={itemsHandler}
                  itemToAdd={itemToAdd}
                  itemComment={itemComment}
                  itemCommentHandler={itemCommentHandler}
                  camelize={camelize}
                  deleteDialogComments={deleteDialogComments}
                  deleteDialogCommentsHandler={deleteDialogCommentsHandler}
                  getTagData={getTagData}
                  tagCloudHandler={tagCloudHandler}
                />
              ) : (
                <CircularProgress />
              )
            }
          />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route
            path='/account'
            element={
              user && users && collections ? (
                <Account
                  user={user}
                  users={users}
                  usersHandler={usersHandler}
                  checkAllUsersHandler={checkAllUsersHandler}
                  checkUserHandler={checkUserHandler}
                  checkedUsers={checkedUsers}
                  collections={collections}
                  addingCollection={addingCollection}
                  collectionsHandler={collectionsHandler}
                  collectionsModalVisibility={collectionsModalVisibility}
                  collectionsModalHandler={collectionsModalHandler}
                  activeCollection={activeCollection}
                  setActiveCollection={setActiveCollection}
                  openCollectionHandler={openCollectionHandler}
                  deleteDialogUsers={deleteDialogUsers}
                  deleteDialogUsersHandler={deleteDialogUsersHandler}
                  deleteDialog={deleteDialogCollections}
                  deleteDialogHandler={deleteDialogCollectionsHandler}
                  collectionsCFError={collectionsCFError}
                  collectionsCategoryHandler={collectionsCategoryHandler}
                />
              ) : (
                <CircularProgress />
              )
            }
          />
          <Route
            path='/items'
            element={
              items && tagSuggestions ? (
                <Items
                  user={user}
                  users={users}
                  activeCollection={activeCollection}
                  activeItems={items}
                  addingItem={addingItem}
                  checkAllItemsHandler={checkAllItemsHandler}
                  checkItemHandler={checkItemHandler}
                  checkedAllItems={checkedAllItems}
                  checkedItems={checkedItems}
                  deleteDialogItems={deleteDialogItems}
                  deleteDialogItemsHandler={deleteDialogItemsHandler}
                  deleteDialogComments={deleteDialogComments}
                  deleteDialogCommentsHandler={deleteDialogCommentsHandler}
                  itemsModalVisibility={itemsModalVisibility}
                  itemsModalHandler={itemsModalHandler}
                  itemsHandler={itemsHandler}
                  itemToAdd={itemToAdd}
                  itemComment={itemComment}
                  itemCommentHandler={itemCommentHandler}
                  camelize={camelize}
                  tagSuggestions={tagSuggestions}
                />
              ) : (
                <Typography fontSize={"2rem"}>
                  {lang === "eng" ? "No collection opened." : "Коллекция не выбрана."}{" "}
                  <Link href='/'>{lang === "eng" ? "Go home?" : "Домой?"}</Link>
                </Typography>
              )
            }
          />
          <Route
            path='/search'
            element={
              <Search
                user={user}
                users={users}
                collections={collections}
                itemsHandler={itemsHandler}
                searchResults={searchResults}
                searchQuery={searchQuery}
                itemCommentHandler={itemCommentHandler}
                deleteDialogComments={deleteDialogComments}
                deleteDialogCommentsHandler={deleteDialogCommentsHandler}
                itemComment={itemComment}
              />
            }
          />
        </Routes>
      </section>
      <footer className='app-footer-parent'>
        <Typography color={"white"}>Eng</Typography>
        <Switch color='default' onChange={languageHandler} defaultChecked={lang === "rus" ? true : false} />
        <Typography color={"white"} mr={"2rem"}>
          Rus
        </Typography>
      </footer>
    </section>
  );
}

export default App;

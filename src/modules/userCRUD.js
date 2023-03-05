import { deleteCollection } from "./collectionCRUD";
import { deleteItem } from "./itemCRUD";

export const getUsers = async (dispatchUsers) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/users`);
  const json = await response.json();
  if (response.ok) {
    dispatchUsers({ type: "SET_USERS", payload: json });
  }
};

export const patchUser = async (u, dispatchUsers) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/users/${u._id}`, {
    method: "PATCH",
    body: JSON.stringify(u),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    console.log("Response for patching user not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchUsers({ type: "PATCH_USER", payload: json });
  }
};

export const deleteUser = async (id, dispatchUsers, items, dispatchItems, collections, dispatchCollections) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/users/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();

  if (!response.ok) {
    console.log("Response for deleting user not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchUsers({ type: "DELETE_USER", payload: json });
    items.forEach((el) => {
      if (el.author === id) deleteItem(el._id, dispatchItems);
    });
    collections.forEach((el) => {
      if (el.author === id) deleteCollection(el._id, dispatchCollections);
    });
    getUsers(dispatchUsers);
  }
};

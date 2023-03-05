import { v4 as uuidv4 } from "uuid";

export const getCollections = async (dispatchCollections) => {
  const responseCollections = await fetch(`${process.env.REACT_APP_URI}/api/collections`);
  const jsonCollections = await responseCollections.json();
  if (responseCollections.ok) {
    dispatchCollections({ type: "SET_COLLECTIONS", payload: jsonCollections });
  }
};

export const postCollection = async (activeCollection, user, dispatchCollections) => {
  const newCollection = {
    _id: uuidv4(),
    name: activeCollection.name,
    description: activeCollection.description,
    category: activeCollection.category,
    author: user._id,
    image: activeCollection.image || "",
    customFields: activeCollection?.customFields || {},
  };

  const response = await fetch(`${process.env.REACT_APP_URI}/api/collections`, {
    method: "POST",
    body: JSON.stringify(newCollection),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  if (!response.ok) {
    console.log("Response for creating collection not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchCollections({ type: "CREATE_COLLECTION", payload: json });
    getCollections(dispatchCollections);
  }
};

export const patchCollection = async (activeCollection, dispatchCollections) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/collections/${activeCollection._id}`, {
    method: "PATCH",
    body: JSON.stringify(activeCollection),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    console.log("Response for patching collection not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchCollections({ type: "PATCH_COLLECTION", payload: json });
  }
};

export const deleteCollection = async (id, dispatchCollections) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/collections/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();

  if (!response.ok) {
    console.log("Response for deleting collection not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchCollections({ type: "DELETE_COLLECTION", payload: json });
  }
};

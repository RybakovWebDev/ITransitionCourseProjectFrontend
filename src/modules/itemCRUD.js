export const getItems = async (dispatchItems, tags, setTagSuggestions) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/items`);
  const json = await response.json();
  if (response.ok) {
    dispatchItems({ type: "SET_ITEMS", payload: json });

    json.map((el) => tags.push(...el.tags));
    setTagSuggestions(tags.filter((value, i, arr) => arr.indexOf(value) === i));
  }
};

export const postItem = async (itemToAdd, dispatchItems, tags, setTagSuggestions) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/items`, {
    method: "POST",
    body: JSON.stringify(itemToAdd),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  if (!response.ok) {
    console.log("Response for creating item not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchItems({ type: "CREATE_ITEM", payload: json });
    getItems(dispatchItems, tags, setTagSuggestions);
  }
};

export const patchItem = async (i, dispatchItems, searchQuery, searchItems, tags, setTagSuggestions) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/items/${i._id}`, {
    method: "PATCH",
    body: JSON.stringify(i),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    console.log("Response for patching item not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchItems({ type: "PATCH_ITEM", payload: json });
    searchQuery ? searchItems(searchQuery) : getItems(dispatchItems, tags, setTagSuggestions);
  }
};

export const deleteItem = async (id, dispatchItems, tags, setTagSuggestions) => {
  const response = await fetch(`${process.env.REACT_APP_URI}/api/items/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();

  if (!response.ok) {
    console.log("Response for deleting item not ok");
    console.log(response.error);
  }
  if (response.ok) {
    dispatchItems({ type: "DELETE_ITEM", payload: json });
    getItems(dispatchItems, tags, setTagSuggestions);
  }
};

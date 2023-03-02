import { Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";
import Collections from "../components/Collections";
import ItemsNewest from "../components/ItemsNewest";

const Home = (props) => {
  if (!props.tagSuggestions) props.getItems();

  useEffect(() => {
    if (props.searchQuery || (props.items && props.items.length === 0)) {
      props.getItems();
      props.setSearchQuery("");
      props.setSearchInput("");
    }
  }, [props]);

  let largestCollections = [];

  if (props.items) {
    const itemsParents = props.items.map((i) => i.collectionID);
    let largestCount = {};
    let sortedBySize = [];

    itemsParents.forEach((x) => {
      largestCount[x] = (largestCount[x] || 0) + 1;
    });

    Object.entries(largestCount).map((el) => {
      sortedBySize.push([el[0], el[1]]);
    });
    sortedBySize
      .sort((a, b) => b[1] - a[1])
      .forEach((el) => {
        largestCollections.push(...props.collections.filter((c) => c._id === el[0]));
      });
  }

  return (
    <article className='app-home-parent'>
      {props.items && props.tagSuggestions ? (
        <div>
          <Typography ml={"6%"} mt={"1rem"} variant='h4'>
            Last added items
          </Typography>
          <ItemsNewest
            homePage={true}
            user={props.user}
            users={props.users}
            collections={props.collections}
            activeItems={props.items.slice(-5).reverse()}
            addingItem={props.addingItem}
            setOpenItem={props.setOpenItem}
            tagsHandler={props.tagsHandler}
            tagSuggestions={props.tagSuggestions}
            checkAllItemsHandler={props.checkAllItemsHandler}
            checkItemHandler={props.checkItemHandler}
            checkedAllItems={props.checkedAllItems}
            checkedItems={props.checkedItems}
            deleteDialog={props.deleteDialog}
            deleteDialogHandler={props.deleteDialogHandler}
            deleteDialogComments={props.deleteDialogComments}
            deleteDialogCommentsHandler={props.deleteDialogCommentsHandler}
            itemsModalVisibility={props.itemsModalVisibility}
            itemsModalHandler={props.itemsModalHandler}
            itemsHandler={props.itemsHandler}
            itemToAdd={props.itemToAdd}
            itemComment={props.itemComment}
            itemCommentHandler={props.itemCommentHandler}
            camelize={props.camelize}
          />
          <Typography ml={"6%"} mt={"1rem"} mb={"2rem"} variant='h4'>
            Largest collections
          </Typography>
          <Collections
            homePage={true}
            user={props.user}
            users={props.users}
            collections={largestCollections.slice(0, 5)}
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
          <div className='home-tags-cloud-parent'>
            <TagCloud
              disableRandomColor
              minSize={12}
              maxSize={35}
              tags={props.getTagData()}
              onClick={(tag) => props.tagCloudHandler(tag)}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </article>
  );
};

export default Home;

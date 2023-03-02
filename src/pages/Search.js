import { Typography } from "@mui/material";
import ItemsNewest from "../components/ItemsNewest";

const Search = (props) => {
  return (
    <article className='app-search-parent'>
      {props.searchResults.length !== 0 && props.searchQuery !== "" && (
        <div>
          <Typography ml={"6%"} mt={"1rem"} variant='h4'>
            {`Search results for "${props.searchQuery}"`}
          </Typography>
          <ItemsNewest
            user={props.user}
            users={props.users}
            activeItems={props.searchResults}
            collections={props.collections}
            itemsHandler={props.itemsHandler}
            //
            itemCommentHandler={props.itemCommentHandler}
            deleteDialogComments={props.deleteDialogComments}
            deleteDialogCommentsHandler={props.deleteDialogCommentsHandler}
            itemComment={props.itemComment}
          />
        </div>
      )}
      {props.searchResults.length === 0 && props.searchQuery !== "" ? (
        <Typography ml={"6%"} mt={"1rem"} variant='h4'>
          {`No results for "${props.searchQuery}". Try searching for something else.`}
        </Typography>
      ) : (
        ""
      )}
      {props.searchQuery === "" && (
        <Typography ml={"6%"} mt={"1rem"} variant='h4'>
          Search results will appear here.
        </Typography>
      )}
    </article>
  );
};

export default Search;

import { Typography } from "@mui/material";
import ItemsNewest from "../components/ItemsList";

const lang = localStorage.getItem("language") || "eng";

const Search = (props) => {
  return (
    <article className='app-search-parent'>
      {props.searchResults.length !== 0 && props.searchQuery !== "" && (
        <div>
          <Typography ml={"6%"} mt={"1rem"} variant='h4'>
            {`${lang === "eng" ? "Search results for" : "Результаты поиска по запросу"}"${props.searchQuery}"`}
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
          {`${lang === "eng" ? "No results for" : "По запросу"} "${props.searchQuery}"${
            lang === "eng"
              ? ". Try searching for something else."
              : " ничего не найдено. Попробуйте задать другой запрос."
          }`}
        </Typography>
      ) : (
        ""
      )}
      {props.searchQuery === "" && (
        <Typography ml={"6%"} mt={"1rem"} variant='h4'>
          {lang === "eng" ? "Search results will appear here." : "Тут будут результаты поиска."}
        </Typography>
      )}
    </article>
  );
};

export default Search;

import * as React from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Favorite, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import Comments from "./Comments";

const RenderItemsTable = (propsTable) => {
  const [rowOpen, setRowOpen] = useState(false);
  const { item, props } = propsTable;
  const comments = item.comments;
  const itemCollection = props.collections.filter((c) => {
    return c._id === item.collectionID ? c : "";
  })[0];

  return (
    <React.Fragment>
      <TableRow className='items-table-element'>
        <TableCell>
          <div className='items-table-element-header-cont'>
            {item.name}
            {item.likes.length > 0 ? (
              <Badge className='bg-secondary text-white items-table-element-likes'>
                <Favorite fontSize='small' />
                {item.likes.length}
              </Badge>
            ) : (
              ""
            )}
          </div>
        </TableCell>
        <TableCell>
          <Autocomplete
            multiple
            id='itemCheckboxesTags'
            options={[]}
            value={item.tags.sort()}
            freeSolo
            readOnly
            size='small'
            renderInput={(params) => <TextField {...params} onClick={(e) => props.itemsHandler(e, "itemTag")} />}
          />
        </TableCell>
        <TableCell>{itemCollection.name}</TableCell>

        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setRowOpen(!rowOpen)}>
            {rowOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ borderBottom: "1px solid lightgrey" }} colSpan={5}>
          <Collapse in={rowOpen} timeout='auto' unmountOnExit>
            <div className='items-table-element-collapse-body-cont'>
              <div className='items-table-element-collapse-body-data'>
                <div className='items-table-element-collapse-body-comments-cont'>
                  <h3 className='items-table-element-collapse-body-comments-label'>Comments</h3>
                  {comments.length === 0 ? (
                    <div className='item-comment-cont'>
                      <p>No comments yet</p>
                    </div>
                  ) : (
                    <Comments
                      user={props.user}
                      users={props.users}
                      activeCollection={itemCollection}
                      comments={comments}
                      itemID={item._id}
                      itemCommentHandler={props.itemCommentHandler}
                      deleteDialogComments={props.deleteDialogComments}
                      deleteDialogCommentsHandler={props.deleteDialogCommentsHandler}
                    />
                  )}
                  {props.user && (
                    <TextField
                      id='itemNewCommentField'
                      label='New comment'
                      multiline
                      maxRows={4}
                      variant='outlined'
                      style={{ width: "90%" }}
                      onChange={props.itemCommentHandler}
                      value={props.itemComment}
                    />
                  )}
                </div>
                {props.user && (
                  <Button
                    id='itemsTableItemCollapseControlsAddComment'
                    className='items-table-element-add-comment__btn'
                    variant='btn btn-outline-dark'
                    onClick={(e) => props.itemCommentHandler(e, item._id)}
                  >
                    Add comment
                  </Button>
                )}
              </div>
              <div className='items-table-element-collapse-body-controls'>
                <Button
                  id='itemsTableItemCollapseControlsOpenCollectionBtn'
                  className='items-table-controls-btn'
                  variant='btn btn-outline-dark'
                  as={Link}
                  to='/items'
                  onClick={(e) => props.itemsHandler(e, item.collectionID)}
                >
                  Open parent collection
                </Button>
                {props.user && (
                  <Button
                    id='itemsTableItemCollapseControlsLikeBtn'
                    className='items-table-controls-btn'
                    variant='btn btn-outline-dark'
                    onClick={(e) => props.itemsHandler(e, item)}
                  >
                    {item.likes.includes(props.user?._id) ? "Dislike" : "Like"}
                  </Button>
                )}
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ItemsNewest = (props) => {
  const items = props.activeItems;
  if (items) {
    return (
      <article className='items-parent'>
        <div className='items-table-cont'>
          <div className='items-table-wrapper'>
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
                  <TableCell style={{ borderBottom: "1px solid lightgrey" }}>Item name</TableCell>
                  <TableCell className='items-table-column-tags' style={{ borderBottom: "1px solid lightgrey" }}>
                    Tags
                  </TableCell>
                  <TableCell style={{ borderBottom: "1px solid lightgrey" }}>Collection</TableCell>
                  <TableCell style={{ borderBottom: "1px solid lightgrey" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, i) => (
                  <RenderItemsTable key={item._id} item={item} i={i} props={props} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </article>
    );
  }
};

export default ItemsNewest;

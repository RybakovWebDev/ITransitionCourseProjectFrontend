import * as React from "react";
import { Badge, Button, FormCheck } from "react-bootstrap";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Collapse,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Favorite, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import dayjs from "dayjs";
import Comments from "./Comments";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import ItemModal from "./ItemModal";

function descendingComparator(a, b, orderBy, cf) {
  if (!cf) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  if (cf) {
    if (b.customFields[orderBy] < a.customFields[orderBy]) {
      return -1;
    }
    if (b.customFields[orderBy] > a.customFields[orderBy]) {
      return 1;
    }
  }
  return 0;
}

function getComparator(order, orderBy, cf) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, cf)
    : (a, b) => -descendingComparator(a, b, orderBy, cf);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(propsTH) {
  const { checkAllItemsHandler, order, orderBy, numChecked, rowCount, onRequestSort, customFields, props } = propsTH;
  const createSortHandler = (cellID, cf) => (event) => {
    onRequestSort(event, cellID, cf);
  };
  const headCells = [
    {
      id: "name",
      label: "Item name",
      cf: false,
    },
    {
      id: "tags",
      label: "Tags",
      cf: false,
    },
  ];

  if (customFields && headCells.length === 2) {
    customFields.map((el) => headCells.push({ id: props.camelize(el[1]), label: el[1], cf: true }));
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell style={{ borderBottom: "1px solid lightgrey" }}>
          {props.user?.admin || props.user?._id === props.activeCollection.author ? (
            <Checkbox
              color='primary'
              indeterminate={numChecked > 0 && numChecked < rowCount}
              checked={rowCount > 0 && numChecked === rowCount}
              onChange={checkAllItemsHandler}
              inputProps={{
                "aria-label": "select all items",
              }}
            />
          ) : (
            ""
          )}
        </TableCell>
        <TableCell style={{ borderBottom: "1px solid lightgrey" }}>#</TableCell>
        {headCells.map((cell, i) =>
          cell.id === "tags" ? (
            <TableCell style={{ borderBottom: "1px solid lightgrey" }}> {cell.label}</TableCell>
          ) : (
            <TableCell
              style={{ borderBottom: "1px solid lightgrey" }}
              key={i}
              sortDirection={orderBy === cell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === cell.id}
                direction={orderBy === cell.id ? order : "asc"}
                onClick={createSortHandler(cell.id, cell.cf)}
              >
                {cell.label}
                {orderBy === cell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        )}
        <TableCell style={{ borderBottom: "1px solid lightgrey" }} />
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numChecked } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numChecked > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numChecked > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color='inherit' variant='subtitle1' component='div'>
          {numChecked} selected
        </Typography>
      ) : (
        ""
      )}
    </Toolbar>
  );
}

const RenderItemsTable = (propsTable) => {
  const [rowOpen, setRowOpen] = useState(false);
  const { item, i, renderCustomFieldColumn, customFields, checkItemHandler, isItemSelected, labelId, props } =
    propsTable;
  const comments = item.comments;

  return (
    <React.Fragment>
      <TableRow className='items-table-element'>
        <TableCell>
          {props.user?.admin || props.user?._id === props.activeCollection.author ? (
            <Checkbox
              color='primary'
              checked={isItemSelected}
              inputProps={{
                "aria-labelledby": labelId,
              }}
              onClick={(e) => checkItemHandler(e, item._id)}
            />
          ) : (
            ""
          )}
        </TableCell>
        <TableCell>{i + 1}</TableCell>
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
        {renderCustomFieldColumn(item)}
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setRowOpen(!rowOpen)}>
            {rowOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ borderBottom: "1px solid lightgrey" }} colSpan={5 + customFields.length}>
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
                      comments={comments}
                      itemID={item._id}
                      itemCommentHandler={props.itemCommentHandler}
                      activeCollection={props.activeCollection}
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
                {props.user?.admin || props.user?._id === props.activeCollection.author ? (
                  <Button
                    id='itemsTableItemCollapseControlsEditBtn'
                    className='items-table-controls-btn'
                    variant='btn btn-outline-dark'
                    onClick={(e) => props.itemsHandler(e, item._id)}
                  >
                    Edit
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const Items = (props) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [customFieldSort, setCustomFieldSort] = useState(false);
  const items = props.activeItems.filter((el) => el.collectionID === props.activeCollection._id);
  const suggestions = props.tagSuggestions.sort().map((el) => ({ label: el }));
  const customFields = props.activeCollection?.customFields || false;
  const newItemName = props.itemToAdd?.name || "";
  const newItemTags = props.itemToAdd?.tags || [];
  const checkedItems = props.checkedItems;

  const handleRequestSort = (e, property, cf) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setCustomFieldSort(cf);
  };

  const isSelected = (id) => checkedItems.indexOf(id) !== -1;

  if (items) {
    const renderCustomFieldColumn = (item) => {
      if (customFields && item.customFields) {
        return customFields.map((el, i) => {
          const field = props.camelize(el[1]);
          const fieldType = el[0];
          if (fieldType === "boolean") {
            return (
              <TableCell key={i}>
                <FormCheck checked={item.customFields[field] || false} readOnly />
              </TableCell>
            );
          }
          if (fieldType === "date")
            return (
              <TableCell key={i}>
                {item.customFields[field] ? dayjs(item.customFields[field]).format("MMM-DD-YYYY") : ""}
              </TableCell>
            );

          return <TableCell key={i}>{item.customFields[field]}</TableCell>;
        });
      }
      if (customFields) {
        return customFields.map((el, i) => <TableCell key={i}>{""}</TableCell>);
      }
    };

    return (
      <article className='items-parent'>
        <div className='items-table-cont'>
          <h2 className='items-table-collection-name'>{props.activeCollection?.name}</h2>
          <div className='items-table-wrapper'>
            <Table
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },
              }}
            >
              <EnhancedTableHead
                numChecked={checkedItems.length}
                order={order}
                orderBy={orderBy}
                checkAllItemsHandler={props.checkAllItemsHandler}
                onRequestSort={handleRequestSort}
                rowCount={items.length}
                customFields={customFields}
                props={props}
              />
              <TableBody>
                {stableSort(items, getComparator(order, orderBy, customFieldSort)).map((item, i) => {
                  const isItemSelected = isSelected(item._id);
                  const labelId = `enhanced-table-checkbox-${i}`;

                  return (
                    <RenderItemsTable
                      key={item._id}
                      item={item}
                      i={i}
                      props={props}
                      suggestions={suggestions}
                      renderCustomFieldColumn={renderCustomFieldColumn}
                      customFields={customFields}
                      checkItemHandler={props.checkItemHandler}
                      labelId={labelId}
                      isItemSelected={isItemSelected}
                    />
                  );
                })}
              </TableBody>
            </Table>
            <EnhancedTableToolbar numChecked={checkedItems.length} />
          </div>

          <div className='items-table-controls-cont'>
            {(props.user && props.user.admin) || props.user?._id === props.activeCollection.author ? (
              <Button
                id='itemsTableControlsAdd'
                className='items-table-controls-btn'
                variant='btn btn-outline-dark'
                onClick={props.itemsHandler}
              >
                New item
              </Button>
            ) : (
              ""
            )}

            {props.checkedItems.length !== 0 ? (
              <div>
                <Button
                  className='items-table-controls-btn'
                  variant='btn btn-outline-dark'
                  onClick={props.deleteDialogItemsHandler}
                >
                  Remove selected
                </Button>

                <Dialog
                  open={props.deleteDialogItems}
                  onClose={props.deleteDialogItemsHandler}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                  fullWidth={true}
                  maxWidth='xs'
                >
                  <DialogTitle id='alert-dialog-title'>{"Are you sure?"}</DialogTitle>

                  <DialogActions>
                    <Button variant='btn btn-outline-primary' onClick={props.deleteDialogItemsHandler}>
                      Cancel
                    </Button>{" "}
                    <Button id='itemsTableControlsRemove' variant='btn btn-outline-danger' onClick={props.itemsHandler}>
                      Remove
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <ItemModal
          props={props}
          suggestions={suggestions}
          newItemName={newItemName}
          newItemTags={newItemTags}
          customFields={customFields}
        />
      </article>
    );
  }
};

export default Items;

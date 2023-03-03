import * as React from "react";
import { Button } from "react-bootstrap";

import { Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const lang = localStorage.getItem("language") || "eng";

const Comments = (props) => {
  if (props.comments)
    return props.comments.map((c, i) => {
      console.log(c);
      return (
        <div className='item-comment-cont' key={i}>
          <div className='item-comment-body'>
            <h4 className='item-comment-name'>{props.users.filter((el) => el._id === c.author)[0].name}</h4>
            <p className='item-comment-text'>{c.text}</p>
          </div>
          {props.user?.admin || props.user?._id === props.activeCollection.author || props.user?._id === c.author ? (
            <div className='item-comment-remove__btn'>
              <IconButton aria-label='delete' id='itemCommentRemoveIcon' onClick={props.deleteDialogCommentsHandler}>
                <ClearIcon />
              </IconButton>
              <Dialog
                open={props.deleteDialogComments}
                onClose={props.deleteDialogCommentsHandler}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                fullWidth={true}
                maxWidth='xs'
              >
                <DialogTitle id='alert-dialog-title'>{"Are you sure?"}</DialogTitle>

                <DialogActions>
                  <Button variant='btn btn-outline-primary' onClick={props.deleteDialogCommentsHandler}>
                    Cancel
                  </Button>{" "}
                  <Button
                    value={i}
                    id='itemCommentRemoveBtn'
                    variant='btn btn-outline-danger'
                    onClick={(e) => props.itemCommentHandler(e, props.itemID, c)}
                  >
                    Remove
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    });
};

export default Comments;

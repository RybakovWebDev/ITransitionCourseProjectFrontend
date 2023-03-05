import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Button } from "react-bootstrap";

const lang = localStorage.getItem("language") || "eng";

const DeleteDialog = (props) => {
  const { open, onClose, onClickCancel, onClickConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      fullWidth={true}
      maxWidth='xs'
    >
      <DialogTitle id='alert-dialog-title'>{lang === "eng" ? "Are you sure?" : "Вы уверены?"}</DialogTitle>

      <DialogActions>
        <Button variant='btn btn-outline-primary' onClick={onClickCancel}>
          {lang === "eng" ? "Cancel" : "Отмена"}
        </Button>{" "}
        <Button id='dialogDeleteConfirmationBtn' variant='btn btn-outline-danger' onClick={onClickConfirm}>
          {lang === "eng" ? "Delete" : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;

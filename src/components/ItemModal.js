import * as React from "react";
import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Form, FormCheck, Modal } from "react-bootstrap";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const lang = localStorage.getItem("language");

const ItemModal = (propsItemModal) => {
  const { props, suggestions, newItemName, newItemTags, customFields } = propsItemModal;
  return (
    <Modal
      show={props.itemsModalVisibility}
      onHide={props.itemsModalHandler}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter' className='item-modal-name-cont'>
          <TextField
            onChange={props.itemsHandler}
            id='itemModalName'
            label={lang === "eng" ? "Item name" : "Название"}
            variant='standard'
            fullWidth={true}
            placeholder={lang === "eng" ? "Item name" : "Название предмета"}
            defaultValue={newItemName}
            error={newItemName ? false : true}
            helperText={newItemName ? "" : lang === "eng" ? "Name required" : "Обязательное поле"}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='' controlId='itemModalTags'>
          <Form.Label>{lang === "eng" ? "Tags" : "Тэги"}</Form.Label>
          <Autocomplete
            multiple
            className='item-modal-tags'
            id='itemCheckboxesTagsAdd'
            options={suggestions.map((t) => t.label)}
            disableCloseOnSelect
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            size='small'
            renderOption={(props, t, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {t}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip onClick={props.itemsHandler} variant='outlined' label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  newItemTags.length !== 0
                    ? lang === "eng"
                      ? "Add tag"
                      : "Добавить тэг"
                    : lang === "eng"
                    ? "Add at least one tag"
                    : "Добавьте хотя бы один тэг"
                }
              />
            )}
            onChange={props.itemsHandler}
            onInputChange={props.itemsHandler}
            onKeyDown={props.itemsHandler}
            value={newItemTags}
          />
        </Form.Group>

        {customFields && props.itemToAdd.customFields
          ? customFields.map((el, i) => {
              const fieldName = props.camelize(el[1]);
              let field;
              if (el[0] === "input" || el[0] === "number")
                field = (
                  <TextField
                    onChange={props.itemsHandler}
                    id={el.join()}
                    variant='outlined'
                    fullWidth
                    defaultValue={props.itemToAdd.customFields[fieldName]}
                    inputProps={{ maxLength: 40 }}
                  />
                );
              if (el[0] === "textarea")
                field = (
                  <TextField
                    id={el.join()}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                    onChange={props.itemsHandler}
                    defaultValue={props.itemToAdd.customFields[fieldName]}
                  />
                );
              if (el[0] === "boolean")
                field = (
                  <FormCheck id={el} onChange={props.itemsHandler} checked={props.itemToAdd.customFields[fieldName]} />
                );
              if (el[0] === "date")
                field = (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={props.itemToAdd.customFields[fieldName]}
                      onChange={(newDate) => {
                        props.itemsHandler(el.join(), newDate);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                );
              return (
                <Form.Group key={i} className=''>
                  <Form.Label className='item-add-field-label'>{el[1]}</Form.Label>
                  {field}
                </Form.Group>
              );
            })
          : ""}
      </Modal.Body>
      <Modal.Footer>
        <Button id='itemModalCancelBtn' variant='btn btn-outline-dark' onClick={props.itemsHandler}>
          {lang === "eng" ? "Cancel" : "Отмена"}
        </Button>
        <Button
          type='submit'
          variant='btn btn-outline-primary'
          id={props.addingItem ? "itemModalAddBtn" : "itemModalSaveBtn"}
          disabled={newItemName && newItemTags.length !== 0 ? false : true}
          onClick={props.itemsHandler}
        >
          {props.addingItem
            ? lang === "eng"
              ? "Add item"
              : "Добавить предмет"
            : lang === "eng"
            ? "Save changes"
            : "Применить изменения"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemModal;

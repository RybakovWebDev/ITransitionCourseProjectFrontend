import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Button, ButtonGroup, Dropdown, DropdownButton, Form, Modal } from "react-bootstrap";
import ImageUpload from "./ImageUpload";

const lang = localStorage.getItem("language") || "eng";

const CollectionModal = (propsCollectionModal) => {
  const { props, colName, categories, colCategory, colDescription, renderCustomFieldList } = propsCollectionModal;
  return (
    <Modal
      show={props.collectionsModalVisibility}
      onHide={props.collectionsModalHandler}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter' className='collection-modal-name-cont'>
          <TextField
            onChange={props.collectionsHandler}
            id='collectionModalName'
            label={lang === "eng" ? "Collection name" : "Название коллекции"}
            variant='standard'
            fullWidth={true}
            defaultValue={colName}
            inputProps={{ maxLength: 50 }}
            error={colName ? false : true}
            helperText={colName ? "" : lang === "eng" ? "Name required" : "Обязательное поле"}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLabel id='collectionModalCategoryLabel'> {lang === "eng" ? "Category" : "Категория"}</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='collectionModalCategory'
          value={colCategory || ""}
          fullWidth={true}
          onChange={props.collectionsCategoryHandler}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>

        <Form.Group className='collection-modal-field-label' controlId='collectionModalDescription'>
          <Form.Label className='collection-modal-field-label-name'>
            {lang === "eng" ? "Description" : "Описание"}
          </Form.Label>
          <Form.Control as='textarea' value={colDescription} onChange={props.collectionsHandler} rows={3} />
        </Form.Group>
        <Form.Group>
          {props.activeCollection.image ? (
            <img
              src={props.activeCollection.image}
              alt={lang === "eng" ? "Collection cover" : "Изображение для коллекции"}
            />
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group>
          <ImageUpload image={props.activeCollection.image} collectionsHandler={props.collectionsHandler} />
          {props.activeCollection.image && (
            <Button
              id='collectionModalRemoveImageBtn'
              variant='btn btn-outline-dark'
              onClick={props.collectionsHandler}
            >
              {lang === "eng" ? "Remove image" : "Удалить изображение"}
            </Button>
          )}
        </Form.Group>
        <Form.Group className='collection-modal-field-label' controlId='collectionModalCustomFields'>
          <Form.Label className='collection-modal-field-label-name'>
            {lang === "eng" ? "Custom fields for child items" : "Дополнительные поля для предметов"}
          </Form.Label>
          {renderCustomFieldList()}
          <DropdownButton
            as={ButtonGroup}
            variant='btn btn-outline-dark'
            size='sm'
            title={lang === "eng" ? "Add new field" : "Добавить поле"}
            id='collectionModalFieldAddBtn'
          >
            <Dropdown.Item id='collectionsModalFieldAdd-InputBtn' as='button' onClick={props.collectionsHandler}>
              {lang === "eng" ? "Short text" : "Короткий текст"}
            </Dropdown.Item>
            <Dropdown.Item id='collectionsModalFieldAdd-TextareaBtn' as='button' onClick={props.collectionsHandler}>
              {lang === "eng" ? "Long text" : "Длинный текст"}
            </Dropdown.Item>
            <Dropdown.Item id='collectionsModalFieldAdd-NumberBtn' as='button' onClick={props.collectionsHandler}>
              {lang === "eng" ? "Number" : "Число"}
            </Dropdown.Item>
            <Dropdown.Item id='collectionsModalFieldAdd-BooleanBtn' as='button' onClick={props.collectionsHandler}>
              {lang === "eng" ? "Checkbox" : "Галочка"}
            </Dropdown.Item>
            <Dropdown.Item id='collectionsModalFieldAdd-DateBtn' as='button' onClick={props.collectionsHandler}>
              {lang === "eng" ? "Date" : "Дата"}
            </Dropdown.Item>
          </DropdownButton>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button id='collectionModalCancelBtn' variant='btn btn-outline-dark' onClick={props.collectionsHandler}>
          {lang === "eng" ? "Cancel" : "Отмена"}
        </Button>
        <Button
          variant='btn btn-outline-primary'
          id={props.addingCollection ? "collectionModalAddBtn" : "collectionModalSaveBtn"}
          disabled={!colName || !colCategory ? true : false}
          onClick={props.collectionsHandler}
        >
          {props.addingCollection
            ? lang === "eng"
              ? "Add collection"
              : "Добавить коллекцию"
            : lang === "eng"
            ? "Save changes"
            : "Применить изменения"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CollectionModal;

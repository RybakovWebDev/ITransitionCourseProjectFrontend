import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, ButtonGroup, Dropdown, DropdownButton, Form, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const categories = ["Books", "Cars", "Games", "Movies", "Wishlist", "Other"];

const Collections = (props) => {
  const collections = props.homePage ? props.collections : props.collections.filter((c) => c.author === props.user._id);

  if (collections) {
    const colName = props.activeCollection?.name;
    const colCategory = props.activeCollection?.category;
    const colDescription = props.activeCollection?.description;
    const colCustom = props.activeCollection?.customFields;

    const renderCustomFieldList = () => {
      if (colCustom)
        return colCustom.map((el, i) => {
          let type;
          if (el[0] === "input") type = "Short text message";
          if (el[0] === "textarea") type = "Long text message";
          if (el[0] === "number") type = "Number";
          if (el[0] === "boolean") type = "Checkbox";
          if (el[0] === "date") type = "Date";

          return (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                <div onClick={(e) => e.stopPropagation()} className='collection-modal-custom-field-item-info-cont'>
                  <TextField
                    id={`collectionModalCustomFieldName,${i}`}
                    label='Field name'
                    variant='standard'
                    error={el[1] ? false : true}
                    helperText={el[1] ? "" : props.collectionsCFError}
                    value={el[1]}
                    onChange={props.collectionsHandler}
                  />

                  <Divider
                    orientation='vertical'
                    sx={{ borderRightWidth: 1, borderColor: "black", marginLeft: "1rem", marginRight: "1rem" }}
                  />

                  <TextField
                    id={"collectionsModalCustomFieldType"}
                    label='Field type'
                    variant='standard'
                    disabled={true}
                    value={type}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails className='collections-modal-custom-field-controls-cont'>
                <Button
                  className='collections-modal-custom-field-controls-btn'
                  variant='btn btn-outline-dark'
                  onClick={props.deleteDialogHandler}
                >
                  Remove
                </Button>

                <Dialog
                  open={props.deleteDialog}
                  onClose={props.deleteDialogHandler}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                  fullWidth={true}
                  maxWidth='xs'
                >
                  <DialogTitle id='alert-dialog-title'>{"Are you sure?"}</DialogTitle>
                  <DialogActions>
                    <Button variant='btn btn-outline-primary' onClick={props.deleteDialogHandler}>
                      Cancel
                    </Button>{" "}
                    <Button
                      value={i}
                      id='collectionModalCustomFieldRemoveBtn'
                      variant='btn btn-outline-danger'
                      onClick={props.collectionsHandler}
                    >
                      Remove
                    </Button>
                  </DialogActions>
                </Dialog>
              </AccordionDetails>
            </Accordion>
          );
        });
    };

    const renderCollectionModal = () => {
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
                label='Collection name'
                variant='standard'
                fullWidth={true}
                defaultValue={colName}
                inputProps={{ maxLength: 50 }}
                error={colName ? false : true}
                helperText={colName ? "" : "Name required"}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputLabel id='collectionModalCategoryLabel'>Category</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='collectionModalCategory'
              value={colCategory || ""}
              label='Age'
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
              <Form.Label className='collection-modal-field-label-name'>Description</Form.Label>
              <Form.Control as='textarea' value={colDescription} onChange={props.collectionsHandler} rows={3} />
            </Form.Group>
            <Form.Group className='collection-modal-field-label' controlId='collectionModalCustomFields'>
              <Form.Label className='collection-modal-field-label-name'>Custom fields for child items</Form.Label>
              {renderCustomFieldList()}
              <DropdownButton
                as={ButtonGroup}
                variant='btn btn-outline-dark'
                size='sm'
                title='Add new field'
                id='collectionModalFieldAddBtn'
              >
                <Dropdown.Item id='collectionsModalFieldAdd-InputBtn' as='button' onClick={props.collectionsHandler}>
                  Short text
                </Dropdown.Item>
                <Dropdown.Item id='collectionsModalFieldAdd-TextareaBtn' as='button' onClick={props.collectionsHandler}>
                  Long text
                </Dropdown.Item>
                <Dropdown.Item id='collectionsModalFieldAdd-NumberBtn' as='button' onClick={props.collectionsHandler}>
                  Number
                </Dropdown.Item>
                <Dropdown.Item id='collectionsModalFieldAdd-BooleanBtn' as='button' onClick={props.collectionsHandler}>
                  Checkbox
                </Dropdown.Item>
                <Dropdown.Item id='collectionsModalFieldAdd-DateBtn' as='button' onClick={props.collectionsHandler}>
                  Date
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button id='collectionModalCancelBtn' variant='btn btn-outline-dark' onClick={props.collectionsHandler}>
              Cancel
            </Button>
            <Button
              variant='btn btn-outline-primary'
              id={props.addingCollection ? "collectionModalAddBtn" : "collectionModalSaveBtn"}
              disabled={!colName || !colCategory ? true : false}
              onClick={props.collectionsHandler}
            >
              {props.addingCollection ? "Add collection" : "Save changes"}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    const renderCollections = () => {
      return collections.length !== 0 ? (
        collections.map((c) => {
          return (
            <ListGroup.Item key={c._id} as='li' className='collections-list-item'>
              <Accordion
                className='collections-list-item-accordion'
                style={{ margin: "0rem 1rem 0rem 1rem", width: "100%" }}
                onChange={(e, expanded) => props.collectionsHandler(e, expanded)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                  <div className='collections-list-item-summary-cont'>
                    <div className='collections-list-item-summary-left'>
                      <h3 className='collections-list-item-name'>{c.name}</h3>
                      <Divider
                        orientation='vertical'
                        sx={{ borderRightWidth: 1, borderColor: "black", marginLeft: "1rem", marginRight: "1rem" }}
                      />
                      <h3 className='collections-list-item-category'>{c.category}</h3>
                    </div>
                    {props.homePage ? (
                      <div className='collections-list-item-summary-right'>
                        <div className='collections-list-item-summary-author-cont'>
                          <h3 className='collections-list-item-author'>
                            {"Author: "}
                            {props.users.map((el) => el._id === c.author && el.name)}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className='collections-list-item-body-content-cont'>
                    <p className='collections-list-item-description'>{c.description}</p>
                  </div>
                  <div className='collections-list-item-body-controls'>
                    <Button
                      id='collectionsListItemOpenBtn'
                      className='collections-list-item-body-button'
                      variant='btn btn-outline-dark'
                      as={Link}
                      to='/items'
                      onClick={(e) => props.collectionsHandler(e, c._id)}
                    >
                      Open
                    </Button>
                    {(props.user && props.user.admin) || props.user?._id === c.author ? (
                      <div>
                        <Button
                          id='collectionsListItemEditBtn'
                          className='collections-list-item-body-button'
                          variant='btn btn-outline-dark'
                          onClick={(e) => props.collectionsHandler(e, c)}
                        >
                          Edit
                        </Button>
                        <Button
                          id='collectionsListItemDeleteBtn'
                          className='collections-list-item-body-btn'
                          variant='btn btn-outline-dark'
                          onClick={(e) => props.collectionsHandler(e, c)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}

                    <Dialog
                      open={props.deleteDialog}
                      onClose={props.deleteDialogHandler}
                      aria-labelledby='alert-dialog-title'
                      aria-describedby='alert-dialog-description'
                      fullWidth={true}
                      maxWidth='xs'
                    >
                      <DialogTitle id='alert-dialog-title'>{"Are you sure?"}</DialogTitle>

                      <DialogActions>
                        <Button variant='btn btn-outline-primary' onClick={props.deleteDialogHandler}>
                          Cancel
                        </Button>{" "}
                        <Button
                          value={c._id}
                          id='collectionsDialogDeleteConfirmationBtn'
                          variant='btn btn-outline-danger'
                          onClick={props.collectionsHandler}
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </AccordionDetails>
              </Accordion>
            </ListGroup.Item>
          );
        })
      ) : (
        <Typography variant='h5' m={2}>
          No collections yet.
        </Typography>
      );
    };

    return (
      <article className='collections-parent'>
        <div className={props.homePage ? "collections-list-cont-home" : "collections-list-cont"}>
          <ListGroup as='ol' numbered={props.homePage ? false : true}>
            {renderCollections()}
            {renderCollectionModal()}
            {props.homePage ? (
              ""
            ) : (
              <div className='collections-list-controls-cont'>
                <Button
                  id='collectionsListControlsAdd'
                  className='collections-list-controls-btn'
                  variant='btn btn-outline-dark'
                  onClick={props.collectionsHandler}
                >
                  New collection
                </Button>
              </div>
            )}
          </ListGroup>
        </div>
      </article>
    );
  }
};

export default Collections;

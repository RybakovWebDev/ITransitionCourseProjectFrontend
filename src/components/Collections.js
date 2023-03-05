import { Accordion, AccordionDetails, AccordionSummary, Divider, TextField, Typography } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CollectionModal from "./CollectionModal";
import DeleteDialog from "./DeleteDialog";

const lang = localStorage.getItem("language") || "eng";
const categoriesEng = ["Books", "Cars", "Games", "Movies", "Wishlist", "Other"];
const categoriesRus = ["Книги", "Машины", "Игры", "Кино", "Список желаний", "Другое"];

const Collections = (props) => {
  const collections = props.homePage ? props.collections : props.collections.filter((c) => c.author === props.user._id);

  const categories = lang === "eng" ? categoriesEng : categoriesRus;

  if (collections) {
    const colName = props.activeCollection?.name;
    const colCategory = props.activeCollection?.category;
    const colDescription = props.activeCollection?.description;
    const colCustom = props.activeCollection?.customFields;

    const renderCustomFieldList = () => {
      if (colCustom)
        return colCustom.map((el, i) => {
          let type;
          if (el[0] === "input") type = lang === "eng" ? "Short text message" : "Короткий текст";
          if (el[0] === "textarea") type = lang === "eng" ? "Long text message" : "Длинный текст";
          if (el[0] === "number") type = lang === "eng" ? "Number" : "Число";
          if (el[0] === "boolean") type = lang === "eng" ? "Checkbox" : "Галочка";
          if (el[0] === "date") type = lang === "eng" ? "Date" : "Дата";

          return (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                <div onClick={(e) => e.stopPropagation()} className='collection-modal-custom-field-item-info-cont'>
                  <TextField
                    style={{ width: "100%" }}
                    id={`collectionModalCustomFieldName,${i}`}
                    label={lang === "eng" ? "Field name" : "Название поля"}
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
                    label={lang === "eng" ? "Field type" : "Тип поля"}
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
                  {lang === "eng" ? "Remove" : "Удалить"}
                </Button>
                <DeleteDialog
                  open={props.deleteDialog}
                  onClose={props.deleteDialogHandler}
                  onClickCancel={props.deleteDialogHandler}
                  onClickConfirm={() => props.collectionsHandler("collectionModalCustomFieldRemoveBtn")}
                />
              </AccordionDetails>
            </Accordion>
          );
        });
    };

    const renderCollections = () => {
      let categoryIndex;
      return collections.length !== 0 ? (
        collections.map((c) => {
          if (categoriesEng.indexOf(c.category) !== -1) categoryIndex = categoriesEng.indexOf(c.category);
          if (categoriesRus.indexOf(c.category) !== -1) categoryIndex = categoriesRus.indexOf(c.category);
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
                      <h3 className='collections-list-item-category'>{categories[categoryIndex]}</h3>
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
                    {c.image ? (
                      <img src={c.image} alt={lang === "eng" ? "Collection cover" : "Изображение для коллекции"} />
                    ) : (
                      ""
                    )}
                    <Typography className='collections-list-item-description' component={"div"}>
                      <ReactMarkdown>{c.description}</ReactMarkdown>
                    </Typography>
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
                      {lang === "eng" ? "Open" : "Открыть"}
                    </Button>
                    {(props.user && props.user.admin) || props.user?._id === c.author ? (
                      <div>
                        <Button
                          id='collectionsListItemEditBtn'
                          className='collections-list-item-body-button'
                          variant='btn btn-outline-dark'
                          onClick={(e) => props.collectionsHandler(e, c)}
                        >
                          {lang === "eng" ? "Edit" : "Редактировать"}
                        </Button>
                        <Button
                          id='collectionsListItemDeleteBtn'
                          className='collections-list-item-body-btn'
                          variant='btn btn-outline-dark'
                          onClick={(e) => props.collectionsHandler(e, c)}
                        >
                          {lang === "eng" ? "Delete" : "Удалить"}
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                    <DeleteDialog
                      open={props.deleteDialog}
                      onClose={props.deleteDialogHandler}
                      onClickCancel={props.deleteDialogHandler}
                      onClickConfirm={props.collectionsHandler}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </ListGroup.Item>
          );
        })
      ) : (
        <Typography variant='h5' m={2}>
          {lang === "eng" ? "No collections yet." : "Пока коллекций нет."}
        </Typography>
      );
    };

    return (
      <article className='collections-parent'>
        <div className={props.homePage ? "collections-list-cont-home" : "collections-list-cont"}>
          <ListGroup as='ol' numbered={props.homePage ? false : true}>
            {renderCollections()}
            <CollectionModal
              props={props}
              colName={colName}
              categories={categories}
              colCategory={colCategory}
              colDescription={colDescription}
              renderCustomFieldList={renderCustomFieldList}
            />
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
                  {lang === "eng" ? "New collection" : "Новая коллекция"}
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

import { Button, ButtonGroup, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useLogout } from "../hooks/useLogout";

const lang = localStorage.getItem("language");

const HeaderMenu = (props) => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <article className='app-header'>
      <div className='navbar-container'>
        <div className='navbar-search-cont'>
          <Form className='navbar-search-form'>
            <Form.Control
              id='searchInput'
              type='search'
              placeholder={lang === "eng" ? "Search items" : "Поиск записей"}
              className='navbar-search'
              aria-label='Search'
              onChange={props.searchHandler}
              value={props.searchInput}
            />
            <Link to='/search'>
              <Button
                type='submit'
                id='searchBtn'
                className='navbar-search__btn'
                variant='btn btn-outline-light'
                onClick={props.searchHandler}
              >
                {lang === "eng" ? "Search" : "Поиск"}
              </Button>
            </Link>
          </Form>
        </div>
        <div className='navbar-controls-cont'>
          <h3 className='logged-user-email'>{props.user && props.user.email}</h3>
          <Link to='/'>
            {" "}
            <Button className='app-menu-top__btn' variant='btn btn-outline-light'>
              {lang === "eng" ? "Home" : "Домой"}
            </Button>
          </Link>
          {!props.user && (
            <Link to='/login'>
              {" "}
              <Button className='app-menu-top__btn' variant='btn btn-outline-light'>
                {lang === "eng" ? "Login" : "Логин"}
              </Button>
            </Link>
          )}
          {!props.user && (
            <Link to='/register'>
              {" "}
              <Button className='app-menu-top__btn' variant='btn btn-outline-light'>
                {lang === "eng" ? "Register" : "Регистрация"}
              </Button>
            </Link>
          )}

          {props.user && (
            <DropdownButton
              as={ButtonGroup}
              drop='down-centered'
              title={props.user.name}
              id='bg-nested-dropdown'
              className='navbar__dropdown'
              variant='outline-light'
            >
              <Dropdown.Item eventKey='1' as={Link} to='/account'>
                {lang === "eng" ? "My account" : "Мой аккаунт"}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey='2' onClick={handleLogout}>
                {lang === "eng" ? "Logout" : "Выход"}
              </Dropdown.Item>
            </DropdownButton>
          )}
        </div>
      </div>
    </article>
  );
};

export default HeaderMenu;

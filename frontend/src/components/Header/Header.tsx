import { useNavigate } from "react-router-dom";

import { useAuth } from "../Authenticate/useAuth";

import "./Header.css";

const Header = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__leftside">
            <a href="/" className="header__logo">
              <img src={process.env.PUBLIC_URL + "/images/silant-logo.svg"} alt="logo" />
            </a>
          </div>
          <div className="header__text">
            <span className="contacts">+7-8352-20-12-09, telegram</span>
            <span className="content">Электронная сервисная книжка "Мой Силант"</span>
          </div>
          <div className="header__button-place">
            <button className="red-back" onClick={() => (isAuthenticated ? signOut(() => navigate("/")) : navigate("/login"))}>
              {isAuthenticated ? "Выйти" : "Авторизация"}
            </button>
          </div>
        </div>
      </header>
      <header className="m-header">
        <div className="m-header__container">
          <div className="m-header__leftside">
            <a href="/" className="m-header__logo">
              <img src={process.env.PUBLIC_URL + "/images/silant-logo.svg"} alt="logo" />
            </a>
            <span className="m-contacts">+7-8352-20-12-09, telegram</span>
          </div>
          <div className="m-header__text">
            <span className="content">Электронная сервисная книжка "Мой Силант"</span>
          </div>
          <div className="m-header__button-place">
            <button className="red-back" onClick={() => (isAuthenticated ? signOut(() => navigate("/")) : navigate("/login"))}>
              {isAuthenticated ? "Выйти" : "Авторизация"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

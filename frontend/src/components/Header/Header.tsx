import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../Authenticate/AuthContext";
import LoginModal from "../../components/Authenticate/LoginModal";
import headerLogo from "../../assets/media/silant-logo-header.svg";
import headerLogoMobile from "../../assets/media/silant-logo-blue.svg";
import "../../styles/Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const toggleMenu = () => setIsMenuActive((prev) => !prev);
  const closeMenu = () => setIsMenuActive(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="header">
        <Link to="/">
          <picture className="header-logo-mobile">
            <source srcSet={headerLogo} media="(min-width: 850px)" />
            <source srcSet={headerLogoMobile} media="(max-width: 849px)" />
            <img className="header-logo" src={headerLogo} alt="logo" />
          </picture>
        </Link>
        <div className="header-text">
          <p className="header-text__contacts">+7-8352-20-12-09, Telegram</p>
          <h1 className="header-text__title">Электронная сервисная книжка<br />"Мой Силант"</h1>
        </div>
        <div className="header-auth">
          {isAuthenticated ? (
            <button className="header-auth__logout-button" onClick={logout}>
              Выйти
            </button>
          ) : (
            <button className="header-auth__login-button" onClick={openLoginModal}>
              Авторизация
            </button>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <div className={`responsive-container ${isMenuActive ? "menu-open" : ""}`}>
        {!isMenuActive && (
          <div className="responsive-button__open" onClick={toggleMenu}></div>
        )}
        {isMenuActive && (
          <div className="responsive-menu" onClick={closeMenu}>
            <div className="responsive-top">
              <img className="responsive-logo" src={headerLogo} alt="logo" />
              <button
                className="responsive-button__close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeMenu();
                }}
              ></button>
            </div>
            <nav className="responsive-nav">
              <div className="responsive-header-text">
                <span className="responsive-header-text__contacts">+7-8352-20-12-09, Telegram</span>
                <span className="responsive-header-text__title">
                  Электронная сервисная книжка<br />"Мой Силант"
                </span>
              </div>
              {isAuthenticated ? (
                <button className="responsive-nav__logout-button" onClick={logout}>
                  <Link to="/">Выйти</Link>
                </button>
              ) : (
                <button className="responsive-nav__login-button" onClick={openLoginModal}>
                  Авторизация
                </button>
              )}
            </nav>
          </div>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLoginSuccess={() => navigate("/")}  />
    </>
  );
};

export default Header;
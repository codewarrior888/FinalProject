import React, { useState, useEffect, useContext } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../Authenticate/useAuth";
import { AuthContext } from "../Authenticate/AuthContext";
import LoginModal from "../../components/Authenticate/LoginModal";
import headerLogo from "../../assets/media/silant-logo-header.svg";
import "../../styles/ResponsiveHeader.scss";

const ResponsiveHeader = () => {
  const [isActive, setActive] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className={`responsive-button__open ${isActive ? "menu-open" : ""}`}>
      <div
        className="responsive-button__open"
        onClick={() => setActive(true)}
      ></div>
      {isActive && (
        <div className="responsive-menu">
          <div className="responsive-top">
            <img className="responsive-logo" src={headerLogo} alt="logo" />
            <button
              className="responsive-button__close"
              onClick={(e) => {
                e.stopPropagation();
                setActive(false);
              }}
            ></button>
          </div>
          <nav className="responsive-nav">
            <div className="header-text">
              <span className="header-text__contacts">+7-8352-20-12-09, Telegram</span>
              <span className="header-text__title">Электронная сервисная книжка "Мой Силант"</span>
            </div>
          </nav>
          {isAuthenticated ? (
            <button 
              className="header-auth__logout" 
              onClick={logout}
            >
              <Link to="/">
                Выйти
              </Link>
            </button>
          ) : (
            <button 
              className="header-auth__login" 
              onClick={openLoginModal}
            >
              Авторизация
            </button>
          )}
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
      )}
    </div>
  );
};

export default ResponsiveHeader;

import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../components/Authenticate/AuthContext";
import LoginModal from "../../components/Authenticate/LoginModal";
import headerLogo from "../../assets/media/silant-logo-header.svg";
import "../../styles/Header.scss";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <header className="header">
        <Link to="/">
          <img className="header-logo" src={headerLogo} alt="logo" />
        </Link>
        <div className="header-text">
          <p className="header-text__contacts">+7-8352-20-12-09, Telegram</p>
          <h1 className="header-text__title">Электронная сервисная книжка "Мой Силант"</h1>
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
      
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
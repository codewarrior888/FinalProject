import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../../components/Authenticate/LoginModal";
import '../../styles/LoggedOutPage.scss';

const LoggedOutPage = () => {
  const navigate = useNavigate();
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <div className="logged-out-page">
        <h1 className="logged-out-page__title">Ваша сессия истекла.</h1>
        <p className="logged-out-page__description">Пожалуйста, войдите в систему заново, чтобы продолжить.</p>
        <button className="logged-out-page__login-button" onClick={openLoginModal}>
          Авторизация
        </button>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLoginSuccess={() => navigate("/")}  />
    </>
  );
};

export default LoggedOutPage;
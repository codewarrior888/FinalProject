// LoginModal.tsx
import React, { useState, useContext, FormEvent } from "react";
import { AuthContext } from "./AuthContext";
import "../../styles/LoginModal.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLoginSuccess: () => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext не определен");
  }

  const { login } = authContext;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError("Неправильное имя пользователя или пароль");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-overlay__content">
        <button onClick={onClose} className="modal-overlay__close-button">X</button>
        <h2>Авторизация</h2>
        <form className="modal-overlay__login-form" onSubmit={handleSubmit}>
          <div className="modal-overlay__login-username">
            <label>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="modal-overlay__login-password">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="modal-overlay__submit-button" type="submit">Вход</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
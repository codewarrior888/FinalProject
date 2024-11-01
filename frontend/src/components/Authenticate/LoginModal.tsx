// LoginModal.tsx
import React, { useState, useContext, FormEvent } from "react";
import { AuthContext } from "./AuthContext";
import "../../styles/LoginModal.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined");
  }

  const { login } = authContext;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      onClose(); // Close modal on successful login
    } catch (err) {
      setError("Incorrect login or password"); // Set error message on failure
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        <h2>Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="submit-button" type="submit">Вход</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
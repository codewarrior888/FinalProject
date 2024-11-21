import { useAuth } from "../Authenticate/useAuth";
import MainAuthenticated from "./MainAuthenticated";
import MainGuest from "./MainGuest";

import "../../styles/Main.scss";

const Main = () => {
  const { isAuthenticated } = useAuth();

  // Загрузить разное меню в зависимости от состояния аутентификации
  return (
    <div className="client-info">
      {isAuthenticated ? <MainAuthenticated /> : <MainGuest />}
    </div>
  );
};

export default Main;

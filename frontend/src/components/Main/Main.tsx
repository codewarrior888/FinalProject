// import { useContext } from "react";
// import { AuthContext } from "../../components/Authenticate/AuthContext";

import { useAuth } from "../Authenticate/useAuth";
import MainAuthenticated from "./MainAuthenticated";
import MainGuest from "./MainGuest";

import "../../styles/Main.scss";

const Main = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="client-info">
      {isAuthenticated ? <MainAuthenticated /> : <MainGuest />}
    </div>
  );
};

export default Main;

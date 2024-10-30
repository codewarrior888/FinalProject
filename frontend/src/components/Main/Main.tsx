import { useAuth } from "../../hook/useAuth";
import "./Main.css";
import SharedInfo from "./SharedInfo/SharedInfo.jsx";
import ClientInfo from "./ClientInfo/ClientInfo.jsx";

const Main = ({ tabIndex, setTabIndex }) => {
  const { isAuthenticated } = useAuth();

  return <article>{!isAuthenticated ? <SharedInfo /> : <ClientInfo tabIndex={tabIndex} setTabIndex={setTabIndex} />}</article>;
};

export default Main;

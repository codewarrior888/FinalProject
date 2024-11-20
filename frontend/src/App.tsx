import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import OpenAPI from "./components/API/OpenAPI";
import "./styles/App.scss";
import "./styles/fonts.scss";

function App() {

  return (
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/api-docs" element={<OpenAPI />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;

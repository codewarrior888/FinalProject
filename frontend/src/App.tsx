import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import "./styles/App.scss";
import "./styles/fonts.scss";

function App() {
  // const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
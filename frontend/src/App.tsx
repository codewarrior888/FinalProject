import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "./fonts/fonts.css";

// import { AuthProvider } from "./hoc/AuthProvider.jsx";
import Header from "./components/Header/Header.js";
import Main from "./components/Main/Main.js";
import Footer from "./components/Footer/Footer.js";

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main tabIndex={tabIndex} setTabIndex={setTabIndex} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

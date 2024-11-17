import React, { StrictMode, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import "./styles/App.scss";
import "./styles/fonts.scss";
import ResponsiveHeader from "./components/Header/ResponsiveHeader";

function App() {

  return (
    <div className="App">
      <Header />
        <StrictMode>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </StrictMode>
      <Footer />
    </div>
  );
}

export default App;

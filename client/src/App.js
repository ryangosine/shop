import React from "react";
import { styled } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import ProductListWrapper from "./components/productList";
import LoginPage from "./pages/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <Header />
      <ProductListWrapper />
    </Router>
  );
};

export default App;

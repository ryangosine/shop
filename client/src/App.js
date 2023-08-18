import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import HomePage from "./pages/homePage";
import {
  CurrentUserContext,
  CurrentUserProvider,
} from "./context/currentusercontext";
import Header from "./components/header";

const App = () => {
  const { currentUser } = useContext(CurrentUserContext);
  return (
    <CurrentUserProvider>
      <Router>
        <Header
          isLoggedIn={!!currentUser.email}
          firstName={currentUser.firstName}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
};

export default App;

import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import HomePage from "./pages/homePage";
import {
  CurrentUserContext,
  CurrentUserProvider,
} from "./context/currentusercontext";
import Header from "./components/header";
import Dashboard from "./pages/dashboard";
import Cart from "./pages/cart";
import Addresses from "./pages/Addresses";
import AddAddressPage from "./pages/AddAddress";
import EditAddressPage from "./pages/EditAddress";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/addresses/new" element={<AddAddressPage />} />
          <Route path="/addresses/:aid/edit" element={<EditAddressPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
};

export default App;

import React, { useContext } from "react";
import { CurrentUserContext } from "../context/currentusercontext";
import axios from "axios";
import { createBrowserHistory } from "history";
import { styled } from "styled-components";

const LogoutButton = () => {
  const history = createBrowserHistory();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setCurrentUser({
        email: null,
        firstName: "",
      });
      localStorage.removeItem("user");
      localStorage.removeItem("firstName");
      history.push("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

const Button = styled.button``;

export default LogoutButton;

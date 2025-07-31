import React, { useContext } from "react";
import { CurrentUserContext } from "../context/currentusercontext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LogoutButton = () => {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      setCurrentUser({ email: null, firstName: "" });
      localStorage.removeItem("user");
      localStorage.removeItem("firstName");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <StyledButton onClick={handleLogout}>Log Out</StyledButton>;
};

const StyledButton = styled.button`
  padding: 10px 18px;
  background-color: #ff4b5c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e63946;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 75, 92, 0.3);
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export default LogoutButton;

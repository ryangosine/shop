import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import LogoutButton from "./logoutButton";

const Header = () => {
  const { currentUser } = useContext(CurrentUserContext);
  return (
    <HeaderWrapper>
      <HeaderTitle>Shop</HeaderTitle>
      {currentUser.email ? (
        <>
          <Greeting>Hello {currentUser.firstName}!</Greeting>
          <LogoutButton />
        </>
      ) : (
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </Nav>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
`;

const HeaderTitle = styled.h1`
  margin: 0;
`;

const Greeting = styled.p``;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

export default Header;

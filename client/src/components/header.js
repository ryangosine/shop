import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import LogoutButton from "./logoutButton";
import { useSelector } from "react-redux";
import CartIcon from "./cartIcon";

const Header = () => {
  const { currentUser } = useContext(CurrentUserContext);

  const cartItems = useSelector((state) => state.cart);

  return (
    <HeaderWrapper>
      <StyledLink to="/" className="link-no-style">
        <HeaderTitle>Shop</HeaderTitle>
      </StyledLink>
      {currentUser.email ? (
        <>
          <Greeting>Hello {currentUser.firstName}!</Greeting>
          <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
          <Link to="/cart">
            <CartIcon itemCount={cartItems.length} />
          </Link>
          <LogoutButton />
        </>
      ) : (
        <Nav>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/login">Login</StyledNavLink>
          <StyledNavLink to="/register">Register</StyledNavLink>
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledNavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: bold;
  }
`;

const Greeting = styled.p``;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const LoggedInNav = styled(Nav)`
  align-items: flex-end;
`;
export default Header;

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
            <CartIcon itemCount={cartItems.length} cartItems={cartItems} />
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
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const StyledNavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;

  display: inline-block;

  margin: 0;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: bold;
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Greeting = styled.p`
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;

  display: inline-block;

  margin: 0;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export default Header;

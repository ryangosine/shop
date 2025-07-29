import React from "react";
import { styled } from "styled-components";

const CartIcon = ({ itemCount }) => {
  return (
    <StyledCartIcon>
      <i className="fa fa-shopping-cart"></i>
      <ItemCount>{itemCount}</ItemCount>
    </StyledCartIcon>
  );
};

const StyledCartIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  .fa-shopping-cart {
    font-size: 24px;
    margin-right: 5px;
  }
`;

const ItemCount = styled.span`
  background-color: #f44336;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 50%;
`;

export default CartIcon;

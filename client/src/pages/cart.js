import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { removeItemFromCart } from "../reducers/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveItemFromCart = (product) => {
    dispatch(removeItemFromCart(product));
  };

  return (
    <CartWrapper>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              {item.name} - ${item.price}
              <RemoveButton onClick={() => handleRemoveItemFromCart(item)}>
                Remove
              </RemoveButton>
            </CartItem>
          ))}
        </ul>
      )}
    </CartWrapper>
  );
};

const CartWrapper = styled.div`
  margin-top: 20px;
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const RemoveButton = styled.button`
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

export default Cart;

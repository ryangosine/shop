import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { removeItemFromCart } from "../reducers/cartSlice";
import { CurrentUserContext } from "../context/currentusercontext";

const Cart = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (itemId, value) => {
    const num = parseInt(value, 10);
    if (num >= 1) {
      setQuantities((prev) => ({ ...prev, [itemId]: num }));
    }
  };

  const handleRemoveItemFromCart = (product) => {
    dispatch(removeItemFromCart(product));
  };

  const handlePurchase = () => {
    if (cartItems.length === 0) return alert("Your cart is empty.");
    alert(`Purchase successful. Check ${currentUser.email} for confirmation.`);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (quantities[item.id] || 1),
    0
  );

  return (
    <CartWrapper>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <CartList>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemInfo>
                  <ItemImage src={item.image} alt={item.title} />
                  <ItemTitle>{item.title}</ItemTitle>
                </ItemInfo>
                <QuantityInput
                  type="number"
                  min="1"
                  value={quantities[item.id]}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                />
                <Price>${(item.price * quantities[item.id]).toFixed(2)}</Price>
                <RemoveButton onClick={() => handleRemoveItemFromCart(item)}>
                  Remove
                </RemoveButton>
              </CartItem>
            ))}
          </CartList>

          <TotalAndCheckout>
            <CartTotal>Total: ${cartTotal.toFixed(2)}</CartTotal>
            <PurchaseButton onClick={handlePurchase}>Purchase</PurchaseButton>
          </TotalAndCheckout>
        </>
      )}
    </CartWrapper>
  );
};

const CartWrapper = styled.div`
  margin: 20px;
  padding: 20px;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  flex-wrap: wrap;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ItemTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const QuantityInput = styled.input`
  width: 60px;
  margin: 0 10px;
  padding: 5px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-right: 20px;
`;

const RemoveButton = styled.button`
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #ff2c2c;
  }
`;

const TotalAndCheckout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const CartTotal = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const PurchaseButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

export default Cart;

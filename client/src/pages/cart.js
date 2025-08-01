import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { removeItemFromCart, clearCart } from "../reducers/cartSlice";
import API from "../api";
import { CurrentUserContext } from "../context/currentusercontext";
import { useNavigate } from "react-router";

const TAX_RATES = {
  gst: 0.05,
  qst: 0.09975,
};

const Cart = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const cartItems = useSelector((state) => state.cart || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const handleRemove = (item) => {
    dispatch(removeItemFromCart(item));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 1),
    0
  );
  const gst = subtotal * TAX_RATES.gst;
  const qst = subtotal * TAX_RATES.qst;
  const total = subtotal + gst + qst;

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id.toString(), // keep consistent with Mongo
        name: item.title,
        price: item.price,
        quantity: quantities[item.id] || 1,
      }));

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await API.post(`/api/users/${currentUser._id}/orders`, {
        items: orderItems,
        totalAmount,
      });

      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Order failed", err);
      alert("Order failed.");
    }
  };

  const handlePurchase = () => {
    alert("Purchase successful. Check your email for confirmation.");
  };

  return (
    <CartWrapper>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <EmptyText>Your cart is empty.</EmptyText>
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
                <RemoveButton onClick={() => handleRemove(item)}>
                  Remove
                </RemoveButton>
              </CartItem>
            ))}
          </CartList>

          <TotalSection>
            <Subtotal>Subtotal: ${subtotal.toFixed(2)}</Subtotal>
            <TaxLine>GST (5%): ${gst.toFixed(2)}</TaxLine>
            <TaxLine>QST (9.975%): ${qst.toFixed(2)}</TaxLine>
            <GrandTotal>Total (incl. taxes): ${total.toFixed(2)}</GrandTotal>
            <PurchaseButton
              onClick={() => {
                handlePurchase();
                handlePlaceOrder();
              }}
            >
              Purchase
            </PurchaseButton>
          </TotalSection>
        </>
      )}
    </CartWrapper>
  );
};

const CartWrapper = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: auto;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #888;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 12px;
  border-bottom: 1px solid #eee;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #ccc;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ItemTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  margin-right: 10px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Price = styled.div`
  width: 90px;
  font-weight: bold;
  text-align: right;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 6px 10px;
  margin: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #b52b3b;
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TotalSection = styled.div`
  width: 300px;
  float: right;
  padding: 20px;
  margin-top: 20px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Subtotal = styled.div`
  font-size: 16px;
  margin-bottom: 6px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TaxLine = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const GrandTotal = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const PurchaseButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export default Cart;

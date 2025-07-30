import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaShoppingCart } from "react-icons/fa";

const CartIcon = ({ itemCount = 0, cartItems = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <IconContainer
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <IconWrapper>
        <FaShoppingCart />
        {itemCount > 0 && <Badge key={itemCount}>{itemCount}</Badge>}
      </IconWrapper>

      {showDropdown && (
        <Dropdown>
          <DropdownTitle>
            You have <strong>{itemCount}</strong> items in your cart
          </DropdownTitle>
          {cartItems.length === 0 ? (
            <EmptyText>Your cart is empty.</EmptyText>
          ) : (
            cartItems.map((item) => (
              <DropdownItem key={item.id}>
                <img src={item.image} alt={item.title} />
                <div>
                  <span>{item.title}</span>
                  <small>${item.price.toFixed(2)}</small>
                </div>
              </DropdownItem>
            ))
          )}
        </Dropdown>
      )}
    </IconContainer>
  );
};

const IconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  background: #f0f0f0;
  border-radius: 50%;
  padding: 10px;
  font-size: 20px;
  color: #333;
  transition: color 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #007bff;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
  `;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f44336;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
  animation: ${pulse} 0.3s ease-in-out;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  width: 260px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  padding: 10px;
`;

const DropdownTitle = styled.h4`
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: #333;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }

  small {
    display: block;
    font-size: 12px;
    color: #666;
  }
`;

const EmptyText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #888;
  margin: 0;
`;

export default CartIcon;

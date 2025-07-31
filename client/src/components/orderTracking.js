import React, { useEffect, useState } from "react";
import API from "../api";
import styled from "styled-components";

const OrderTracking = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get(`/api/users/${user.id}/orders`).then((response) => {
      setOrders(response.data);
    });
  }, [user.id]);

  return (
    <OrderTrackingContainer>
      <h2>Order Tracking</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order ID: {order.id}, Total: ${order.totalAmount}
          </li>
        ))}
      </ul>
    </OrderTrackingContainer>
  );
};

const OrderTrackingContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
`;

export default OrderTracking;

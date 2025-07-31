import React, { useContext, useEffect, useState } from "react";
import API from "../api";
import styled from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/api/users/${currentUser._id}/orders`);
        setOrders(res.data);
      } catch {
        setError("Failed to fetch orders.");
      }
    };

    if (currentUser._id) fetchOrders();
  }, [currentUser._id]);

  const handleReorder = async (orderId) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) return;

      // Add each item to the cart
      for (const item of order.items) {
        await API.post("/api/cart", {
          productId: item.productId,
          quantity: item.quantity || 1,
        });
      }

      navigate("/cart");
    } catch (err) {
      console.error("Reorder failed", err);
      alert("Reorder failed. Please try again.");
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (dateFilter !== "all") {
      const days = { week: 7, "2weeks": 14, month: 30, "3months": 90 }[
        dateFilter
      ];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= cutoff
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  return (
    <Wrapper>
      <h2>Order History</h2>
      {error && <Error>{error}</Error>}

      <Controls>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="week">Past Week</option>
          <option value="2weeks">Past 2 Weeks</option>
          <option value="month">Past Month</option>
          <option value="3months">Past 3 Months</option>
        </select>

        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Controls>

      {filterOrders().length === 0 ? (
        <p>No orders match your filter.</p>
      ) : (
        filterOrders().map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <strong>Order ID:</strong> {order._id}
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </OrderHeader>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — ${item.price.toFixed(2)} × {item.quantity}
                </li>
              ))}
            </ul>
            <Total>Total: ${order.totalAmount.toFixed(2)}</Total>
            <ReorderBtn onClick={() => handleReorder(order._id)}>
              Reorder
            </ReorderBtn>
          </OrderCard>
        ))
      )}
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: auto;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  select,
  input {
    padding: 8px;
    font-size: 16px;
  }
`;

const OrderCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Total = styled.p`
  font-weight: bold;
  margin-top: 12px;
`;

const ReorderBtn = styled.button`
  margin-top: 12px;
  background: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
`;

export default OrderHistoryPage;

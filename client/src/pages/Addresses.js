import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import API from "../api";
import { CurrentUserContext } from "../context/currentusercontext";
import { useNavigate } from "react-router-dom";

const Addresses = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get(`/api/users/${currentUser._id}/addresses`);
        setAddresses(res.data);
      } catch {
        setError("Failed to fetch addresses.");
      }
    };
    if (currentUser._id) fetchAddresses();
  }, [currentUser._id]);

  const handleSetDefault = async (aid) => {
    try {
      await API.put(`/api/users/${currentUser._id}/addresses/${aid}`, {
        isDefault: true,
      });
      // Update local state: mark this address as default, others as not default
      setAddresses(
        addresses.map((addr) =>
          addr._id === aid
            ? { ...addr, isDefault: true }
            : { ...addr, isDefault: false }
        )
      );
    } catch {
      setError("Failed to set default address.");
    }
  };

  const handleDelete = async (aid) => {
    try {
      await API.delete(`/api/users/${currentUser._id}/addresses/${aid}`);
      setAddresses(addresses.filter((addr) => addr._id !== aid));
    } catch {
      setError("Failed to delete address.");
    }
  };

  return (
    <AddressesWrapper>
      <h2>Your Addresses</h2>
      {error && <ErrorText>{error}</ErrorText>}

      <AddressList>
        {addresses.map((addr) => (
          <AddressCard key={addr._id}>
            {addr.isDefault && <DefaultBadge>Default</DefaultBadge>}
            <AddressInfo>
              {/* Display name (using user's name here) and address lines */}
              <p>
                <strong>
                  {currentUser.firstName} {currentUser.lastName}
                </strong>
              </p>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.province}, {addr.postalCode}
              </p>
              {addr.country && <p>{addr.country}</p>}
            </AddressInfo>
            <CardActions>
              <ActionButton
                onClick={() =>
                  navigate(`/addresses/${addr._id}/edit`, {
                    state: { address: addr },
                  })
                }
              >
                Edit
              </ActionButton>
              <ActionButton onClick={() => handleDelete(addr._id)}>
                Delete
              </ActionButton>
              {!addr.isDefault && (
                <ActionButton onClick={() => handleSetDefault(addr._id)}>
                  Set as default
                </ActionButton>
              )}
            </CardActions>
          </AddressCard>
        ))}

        {/* Add New Address button */}
        <AddAddressButton onClick={() => navigate("/addresses/new")}>
          + Add New Address
        </AddAddressButton>
      </AddressList>
    </AddressesWrapper>
  );
};

const AddressesWrapper = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddressCard = styled.div`
  position: relative;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #007bff;
  color: #fff;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
`;

const AddressInfo = styled.div`
  line-height: 1.6;
  margin-bottom: 12px;
`;

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ccc;
  color: #333;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
  }
`;

const AddAddressButton = styled.button`
  align-self: flex-start;
  background: #007bff;
  color: #fff;
  padding: 10px 16px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`;

export default Addresses;

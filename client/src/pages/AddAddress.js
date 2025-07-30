import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { CurrentUserContext } from "../context/currentusercontext";
import { useNavigate } from "react-router-dom";

const AddAddressPage = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Client-side required field check
    if (
      !formData.street ||
      !formData.city ||
      !formData.province ||
      !formData.postalCode
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await axios.post(`/api/users/${currentUser._id}/addresses`, {
        ...formData,
        isDefault: false,
      });
      navigate("/addresses"); // go back to addresses list after adding
    } catch (err) {
      // Show server error message if provided, else a generic one
      const msg = err.response?.data?.error || "Failed to add address.";
      setError(msg);
    }
  };

  return (
    <FormWrapper>
      <h2>Add New Address</h2>
      {error && <ErrorText>{error}</ErrorText>}
      <form onSubmit={handleSubmit}>
        <label>Street Address:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Province/State:</label>
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
          required
        />

        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Address</button>
      </form>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  max-width: 400px;
  margin: 40px auto;
  form {
    display: flex;
    flex-direction: column;
    label {
      margin: 10px 0 4px;
      font-weight: bold;
    }
    input {
      padding: 8px;
      margin-bottom: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        background-color: #0056b3;
      }
    }
  }
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`;

export default AddAddressPage;

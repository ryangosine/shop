import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import API from "../api";
import { CurrentUserContext } from "../context/currentusercontext";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const EditAddressPage = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { aid } = useParams(); // address ID from URL

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load existing address data
  useEffect(() => {
    if (location.state && location.state.address) {
      // If address data was passed via navigation state
      setFormData({
        street: location.state.address.street,
        city: location.state.address.city,
        province: location.state.address.province,
        postalCode: location.state.address.postalCode,
      });
      setLoading(false);
    } else {
      // Otherwise, fetch addresses and find the one to edit
      const fetchAddress = async () => {
        try {
          const res = await API.get(`/api/users/${currentUser._id}/addresses`);
          const addr = res.data.find((a) => a._id === aid);
          if (addr) {
            setFormData({
              street: addr.street,
              city: addr.city,
              province: addr.province,
              postalCode: addr.postalCode,
            });
          } else {
            setError("Address not found.");
          }
        } catch {
          setError("Failed to load address.");
        } finally {
          setLoading(false);
        }
      };
      fetchAddress();
    }
  }, [aid, currentUser._id, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.put(`/api/users/${currentUser._id}/addresses/${aid}`, formData);
      navigate("/addresses");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update address.";
      setError(msg);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <FormWrapper>
      <h2>Edit Address</h2>
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

        <button type="submit">Save Changes</button>
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

export default EditAddressPage;

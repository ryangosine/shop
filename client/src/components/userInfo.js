import API from "../api";
import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

const UserInformation = ({ user }) => {
  const [newPassword, setNewPassword] = useState("");
  console.log("User ID", user._id);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (newPassword && !passwordRegex.test(newPassword)) {
      setError(
        "Password must include at least 1 lowercase, 1 uppercase, and 1 special character."
      );
    } else {
      setError("");
    }
  }, [newPassword]);

  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
    } else if (!passwordRegex.test(newPassword)) {
      // keep previous error
    } else {
      setError("");
    }
  }, [confirmPassword, newPassword]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (error || !newPassword || !confirmPassword) return;

    try {
      const response = await API.put(`/api/users/${user._id}/password`, {
        newPassword,
      });

      setMessage(response.data.message || "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to update password.");
    }
  };

  return (
    <UserInfoContainer>
      <h2>User Information</h2>
      <p>
        <strong>Name:</strong> {user.firstName}
      </p>
      <p>
        <strong>E-MAIL:</strong> {user.email}
      </p>

      <form onSubmit={handleChangePassword}>
        <input
          type="email"
          name="email"
          autoComplete="username"
          value={user.email}
          readOnly
          hidden
        />

        <label>New Password:</label>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm New Password:</label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Change Password</button>

        {error && <ErrorText>{error}</ErrorText>}
        {message && <SuccessText>{message}</SuccessText>}
      </form>
    </UserInfoContainer>
  );
};

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    width: 300px;

    label {
      margin-top: 10px;
      font-weight: bold;
    }

    input {
      padding: 8px;
      margin-top: 4px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    button {
      margin-top: 16px;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: #0062cc;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ErrorText = styled.p`
  margin-top: 10px;
  color: red;
  font-weight: bold;
`;

const SuccessText = styled.p`
  margin-top: 10px;
  color: green;
  font-weight: bold;
`;

export default UserInformation;

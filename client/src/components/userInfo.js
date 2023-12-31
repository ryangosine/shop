import axios from "axios";
import React, { useState } from "react";
import { styled } from "styled-components";

const UserInformation = ({ user }) => {
  const [newPassword, setNewPassword] = useState("");
  console.log("User ID", user._id);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log("User ID", user._id);

    if (!newPassword) {
      console.log("New Password Is Empty");
      return;
    }

    try {
      // Send the new password to the backend to be updated
      const response = await axios.put(`/api/users/${user._id}/password`, {
        newPassword: newPassword,
      });
      console.log(response.data.message);
      setNewPassword("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserInfoContainer>
      <h2>User Information</h2>
      <p>Name: {user.firstName}</p>
      <p>Email: {user.email}</p>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </UserInfoContainer>
  );
};

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default UserInformation;

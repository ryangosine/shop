import React, { useState } from "react";
import { styled } from "styled-components";
import axios from "axios";
import Header from "../components/header";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = { email, password };
      console.log("request payload", requestData);
      await axios.post("/register", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Registration successful");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <RegistrationContainer>
        <h2>Registration Page</h2>
        <RegistrationForm onSubmit={handleSubmit}>
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton type="submit">Register</SubmitButton>
        </RegistrationForm>
      </RegistrationContainer>
    </>
  );
};

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputField = styled.input`
  width: 300px;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default RegistrationPage;

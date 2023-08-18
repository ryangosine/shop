import React, { useContext, useState } from "react";
import { styled } from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import axios from "axios";

const LoginPage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const requestData = { email, password };
      console.log("requestData", requestData);
      const response = await axios.post("/login", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { firstName } = response.data;
      localStorage.setItem("user", email);
      localStorage.setItem("firstName", firstName);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        email,
        firstName,
      }));
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <LoginContainer>
        <h2>Log In </h2>
        <LoginForm onSubmit={handleLogin}>
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
          <SubmitButton type="submit">Log In</SubmitButton>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const LoginForm = styled.form`
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

export default LoginPage;

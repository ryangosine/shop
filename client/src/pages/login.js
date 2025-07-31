import React, { useContext, useState, useEffect } from "react";
import { styled } from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import API from "../api";

const LoginPage = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const requestData = { email, password };
      const response = await API.post("/login", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { _id, firstName } = response.data;
      localStorage.setItem("user", JSON.stringify({ email, firstName, _id }));
      setCurrentUser({ ...currentUser, email, firstName, _id });
      setLoggedIn(true);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data?.error) {
        const errMsg = error.response.data.error.toLowerCase();

        if (errMsg.includes("password")) {
          setLoginError("Password does not match our records.");
        } else if (errMsg.includes("email")) {
          setLoginError("No account found with this email.");
        } else {
          setLoginError("Login failed. Please try again.");
        }
      } else {
        setLoginError("Network error or server unavailable.");
      }
    }
  };

  useEffect(() => {
    if (loggedIn) {
      window.location.href = "/";
    }
  }, [loggedIn]);

  return (
    <LoginContainer>
      <h2>Log In</h2>
      <LoginForm onSubmit={handleLogin}>
        <InputField
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError && <ErrorText>{loginError}</ErrorText>}
        <SubmitButton type="submit">Log In</SubmitButton>
      </LoginForm>
    </LoginContainer>
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
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const InputField = styled.input`
  width: 300px;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
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
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9em;
  margin: 6px 0;
`;

export default LoginPage;

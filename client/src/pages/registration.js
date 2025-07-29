import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import axios from "axios";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (password && !passwordRegex.test(password)) {
      setPasswordError(
        "Password must include at least 1 lowercase, 1 uppercase, and 1 special character."
      );
    } else {
      setPasswordError("");
    }
  }, [password]);

  useEffect(() => {
    if (passwordConfirm && passwordConfirm !== password) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError("");
    }
  }, [passwordConfirm, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setNameError("First name and last name are required.");
      return;
    } else {
      setNameError("");
    }

    if (passwordError || confirmError) return;

    try {
      const requestData = {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      };

      await axios.post("/register", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      alert("Registration successful");
      window.location.href = "/login";
    } catch (error) {
      if (error.response && error.response.data.error) {
        const errMsg = error.response.data.error;
        if (errMsg.toLowerCase().includes("email")) {
          setEmailError(errMsg);
        } else if (errMsg.toLowerCase().includes("password")) {
          setPasswordError(errMsg);
        } else {
          alert(errMsg);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      <RegistrationContainer>
        <h2>Registration Page</h2>
        <RegistrationForm onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {nameError && <ErrorText>{nameError}</ErrorText>}

          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}

          <PasswordWrapper>
            <InputField
              as="input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "40px" }}
            />
            <EyeToggle onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? "👁️" : "🙈"}
            </EyeToggle>
          </PasswordWrapper>
          {passwordError && <ErrorText>{passwordError}</ErrorText>}

          <PasswordWrapper>
            <InputField
              as="input"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="Password Confirmation"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={{ paddingRight: "40px" }}
            />
            <EyeToggle onClick={() => setShowPasswordConfirm((prev) => !prev)}>
              {showPasswordConfirm ? "👁️" : "🙈"}
            </EyeToggle>
          </PasswordWrapper>
          {confirmError && <ErrorText>{confirmError}</ErrorText>}

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
  width: 320px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 5px 0;
`;

const EyeToggle = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2em;
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

const ErrorText = styled.p`
  color: red;
  font-size: 0.9em;
`;

export default RegistrationPage;

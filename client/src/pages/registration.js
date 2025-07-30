import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import axios from "axios";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;
const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const emptyAddr = { street: "", city: "", province: "", postalCode: "" };
  const [addr, setAddr] = useState(emptyAddr);

  const [showPwd, setShowPwd] = useState(false);
  const [showPwdC, setShowPwdC] = useState(false);

  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [confErr, setConfErr] = useState("");
  const [addrErr, setAddrErr] = useState("");

  useEffect(() => {
    if (password && !passwordRegex.test(password))
      setPwdErr(
        "Password must include at least 1 lowercase, 1 uppercase, and 1 special character."
      );
    else setPwdErr("");
  }, [password]);

  useEffect(() => {
    if (passwordConfirm && passwordConfirm !== password)
      setConfErr("Passwords do not match.");
    else setConfErr("");
  }, [passwordConfirm, password]);

  /* ----------  submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* names present */
    if (!firstName || !lastName) {
      setNameErr("First and last name are required.");
      return;
    } else setNameErr("");

    /* address valid */
    const addressOK =
      addr.street &&
      addr.city &&
      addr.province &&
      postalRegex.test(addr.postalCode);
    if (!addressOK) {
      setAddrErr("Please enter a valid Canadian address.");
      return;
    } else setAddrErr("");

    /* password rules passed? */
    if (pwdErr || confErr) return;

    try {
      await axios.post(
        "/register",
        {
          firstName,
          lastName,
          email,
          password,
          passwordConfirm,
          address: addr,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (err) {
      if (err.response?.data?.error) {
        const msg = err.response.data.error;
        if (msg.toLowerCase().includes("email")) setEmailErr(msg);
        else alert(msg);
      } else console.error(err);
    }
  };

  return (
    <Container>
      <h2>Register</h2>

      <Form onSubmit={handleSubmit}>
        {/* --- Card 1 : user details --- */}
        <Card>
          <h3>User Information</h3>
          <Input
            placeholder="First Name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {nameErr && <Err>{nameErr}</Err>}

          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailErr && <Err>{emailErr}</Err>}

          {/* password */}
          <PwdWrap>
            <Input
              as="input"
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Eye onClick={() => setShowPwd((p) => !p)}>
              {showPwd ? "👁️" : "🙈"}
            </Eye>
          </PwdWrap>
          {pwdErr && <Err>{pwdErr}</Err>}

          <PwdWrap>
            <Input
              as="input"
              type={showPwdC ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Eye onClick={() => setShowPwdC((p) => !p)}>
              {showPwdC ? "👁️" : "🙈"}
            </Eye>
          </PwdWrap>
          {confErr && <Err>{confErr}</Err>}
        </Card>

        {/* --- Card 2 : address --- */}
        <Card>
          <h3>Shipping Address</h3>
          <Input
            placeholder="Street"
            value={addr.street}
            onChange={(e) => setAddr({ ...addr, street: e.target.value })}
          />
          <Input
            placeholder="City"
            value={addr.city}
            onChange={(e) => setAddr({ ...addr, city: e.target.value })}
          />
          <Input
            placeholder="Province"
            value={addr.province}
            onChange={(e) => setAddr({ ...addr, province: e.target.value })}
          />
          <Input
            placeholder="Postal Code"
            value={addr.postalCode}
            onChange={(e) => setAddr({ ...addr, postalCode: e.target.value })}
          />
          {addrErr && <Err>{addrErr}</Err>}
        </Card>

        {/* submit below both cards */}
        <Submit>Register</Submit>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  max-width: 900px;
`;

const Card = styled.div`
  flex: 1 1 340px;
  min-width: 320px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background: #fff;

  h3 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
  box-sizing: border-box;
`;

const PwdWrap = styled.div`
  position: relative;
  width: 100%;
`;

const Eye = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const Submit = styled.button`
  flex-basis: 100%;
  padding: 12px 28px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const Err = styled.p`
  color: red;
  font-size: 0.85em;
  margin: 4px 0 0;
`;

export default RegistrationPage;

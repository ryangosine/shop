import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import { CurrentUserContext } from "../context/currentusercontext";
import UserInformation from "../components/userInfo";

const Dashboard = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  console.log("Current User", currentUser);

  const toggleCardExpansion = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") {
      e.stopPropagation();
      return;
    }
    setIsCardExpanded(!isCardExpanded);
  };

  return (
    <>
      <DashboardWrapper>
        <h1>Dashboard</h1>
        <UserCard
          onClick={toggleCardExpansion}
          isexpanded={isCardExpanded.toString()}
        >
          {isCardExpanded ? (
            <UserInformation user={currentUser} />
          ) : (
            <CardContent>
              <h3>{currentUser.firstName}</h3>
              <p>{currentUser.email}</p>
              <p>Click to view user information</p>
            </CardContent>
          )}
        </UserCard>
      </DashboardWrapper>
    </>
  );
};

const DashboardWrapper = styled.div``;
const UserCard = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-5px);
  }
`;

const CardContent = styled.div`
  ${(props) =>
    props.isexpanded &&
    css`
      display: flex;
      flex-direction: column;
      align-items: center;

      h3 {
        margin-bottom: 5px;
      }

      p {
        margin: 0;
      }
    `}
`;

export default Dashboard;

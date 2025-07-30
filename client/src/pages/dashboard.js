import React, { useContext, useState } from "react";
import styled from "styled-components";
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
    <DashboardWrapper>
      <h1>Dashboard</h1>
      <UserCard
        onClick={toggleCardExpansion}
        $isexpanded={isCardExpanded.toString()}
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
  );
};

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const UserCard = styled.div`
  background-color: #f9f9f9;
  border: 2px solid #007bff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 123, 255, 0.2);
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  text-align: center;

  h3 {
    font-size: 22px;
    margin-bottom: 10px;
  }

  p {
    margin: 6px 0;
    font-size: 16px;
  }
`;

export default Dashboard;

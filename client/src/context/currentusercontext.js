import React, { createContext, useEffect, useState } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    email: null,
    firstName: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("loggedInUser", loggedInUser);
    if (loggedInUser) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        email: loggedInUser,
        firstName: localStorage.getItem("firstName") || "",
      }));
      setLoggedIn(true);
    } else {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        firstName: "",
      }));
      setLoggedOut(true);
    }
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loggedIn,
        setLoggedIn,
        loggedOut,
        setLoggedOut,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

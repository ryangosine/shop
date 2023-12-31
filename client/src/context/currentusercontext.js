import React, { createContext, useEffect, useState } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    _id: null,
    email: null,
    firstName: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("loggedInUser", loggedInUser);
    if (loggedInUser) {
      const userFromLocalStorage = JSON.parse(loggedInUser);
      setCurrentUser({
        _id: userFromLocalStorage._id,
        ...userFromLocalStorage,
      });
      setLoggedIn(true);
    } else {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        firstName: "",
      }));
      setLoggedOut(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      // Store the updated currentUser in localStorage whenever it changes
      setCurrentUser((prevUser) => {
        localStorage.setItem("user", JSON.stringify(prevUser));
        return prevUser;
      });
    }
  }, [loggedIn, currentUser]);

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

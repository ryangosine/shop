import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {}
};

const preloadedState = {
  cart: loadCartFromStorage(),
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  saveCartToStorage(store.getState());
});

export default store;

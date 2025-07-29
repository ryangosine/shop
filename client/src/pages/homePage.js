import React from "react";
import ProductList from "../components/productList";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../reducers/cartSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
  };

  return (
    <>
      <ProductList onAddToCart={handleAddToCart} />
    </>
  );
};

export default HomePage;

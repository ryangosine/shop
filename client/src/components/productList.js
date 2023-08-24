import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <CategoryHeader>
        <CategoryButton
          active={selectedCategory.toString() === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </CategoryButton>
        <CategoryButton
          active={selectedCategory.toString() === "jewelery"}
          onClick={() => setSelectedCategory("jewelery")}
        >
          Jewelry
        </CategoryButton>
        <CategoryButton
          active={selectedCategory.toString() === "men's clothing"}
          onClick={() => setSelectedCategory("men's clothing")}
        >
          Men's Clothing
        </CategoryButton>
        <CategoryButton
          active={selectedCategory.toString() === "women's clothing"}
          onClick={() => setSelectedCategory("women's clothing")}
        >
          Women's Clothing
        </CategoryButton>
        <CategoryButton
          active={selectedCategory.toString() === "electronics"}
          onClick={() => setSelectedCategory("electronics")}
        >
          Electronics
        </CategoryButton>
      </CategoryHeader>

      <ProductListWrapper>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id}>
            <h2>{product.title}</h2>
            <ProductImage src={product.image} alt={product.title} />
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
          </ProductCard>
        ))}
      </ProductListWrapper>
    </>
  );
};

const CategoryHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CategoryButton = styled.button`
  /* Basic button styles */
  padding: 10px 20px;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      background-color: #007bff;
      color: white;
      font-weight: bold;
    `}
`;

const ProductListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
`;

export default ProductList;

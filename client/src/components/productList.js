import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "styled-components";

const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <ProductListWrapper>
      <ProductListContainer>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <h2>{product.title}</h2>
            <ProductImage src={product.image} alt={product.title} />
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
          </ProductCard>
        ))}
      </ProductListContainer>
    </ProductListWrapper>
  );
};

const ProductListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ProductListContainer = styled.div``;

const ProductCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 200px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
`;

export default ProductList;

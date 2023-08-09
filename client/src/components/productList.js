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

        {products.map((product) => (
          <ProductCard key={product.id}>
            <h2>{product.title}</h2>
            <ProductImage src={product.image} alt={product.title} />
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
          </ProductCard>
        ))}

    </ProductListWrapper>
  );
};

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

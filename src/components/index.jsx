import React, { useEffect, useState } from "react";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";

function LoadMoreData() {
  // State variables
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [count, setCount] = useState(0); // State to track the number of times 'Load More' button is clicked
  const [disableButton, setDisableButton] = useState(false); // State to disable 'Load More' button when all products are loaded

  // Function to fetch products from dummy API
  async function fetchProducts() {
    try {
      setLoading(true); // Set loading state to true
      // Fetch products with limit and skip based on count
      const response = await fetch(
        `https://dummyjson.com/products?limit=18&skip=${
          count === 0 ? 0 : count * 20
        }`
      );
      const result = await response.json(); // Parse response as JSON
      if (result && result.products && result.products.length > 0) {
        // If products are fetched successfully
        setProducts((prevProducts) => [...prevProducts, ...result.products]); // Update products state with new products
        setLoading(false); // Set loading state to false
      } else {
        // If no more products to load
        setDisableButton(true); // Disable 'Load More' button
      }
      console.log(result); // Log the result (for debugging)
    } catch (error) {
      console.error("Error fetching products:", error); // Log error if fetching fails
      setLoading(false); // Set loading state to false
    }
  }

  // useEffect hook to fetch products when component mounts or 'count' changes
  useEffect(() => {
    fetchProducts();
  }, [count]);

  // Function to handle 'Load More' button click
  const handleLoadMore = () => {
    setCount(count + 1); // Increment 'count' state to fetch more products
  };

  // Render the component
  return (
    <div className="load-more-container">
      {/* Container for displaying products */}
      <div className="product-container">
        {products && products.length > 0 ? ( // Check if products array has items
          products.map((item) => (
            <div className="product" key={uuidv4()}>
              {" "}
              {/* Map through products and render each product */}
              <img src={item.thumbnail} alt={item.title} />{" "}
              {/* Product image */}
              <p>{item.title}</p> {/* Product title */}
            </div>
          ))
        ) : (
          <div className="loading-indicator">Loading data! Please wait...</div> // Display loading message if no products yet
        )}
      </div>
      {/* Container for 'Load More' button */}
      <div className="button-container">
        <button disabled={disableButton} onClick={handleLoadMore}>
          {disableButton ? "All Products Loaded" : "Load More Products"}{" "}
          {/* Button text changes based on disableButton state */}
        </button>
        {disableButton && ( // Display end message when all products are loaded
          <p className="end-message">You have reached the end of products.</p>
        )}
      </div>
    </div>
  );
}

export default LoadMoreData;

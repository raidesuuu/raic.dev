import React from "react";
import * as ProductsComponent from "@components/Products";

const Products: React.FC = () => {
  return (
    <div className="min-h-screen mt-16 p-8">
      <ProductsComponent.default />
    </div>
  );
};

export default Products;

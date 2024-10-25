import React from 'react';
import * as ProductsComponent from '@components/Products';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <ProductsComponent.default />
    </div>
  );
};

export default Products;

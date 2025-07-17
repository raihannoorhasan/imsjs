import React, { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Card } from '../common/Card';
import { SearchInput } from '../common/SearchInput';
import { Button } from '../common/Button';

export function ProductSelection({ products, onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesPrice = product.sellingPrice >= priceRange.min && product.sellingPrice <= priceRange.max;
    const inStock = product.stock > 0;
    
    return matchesSearch && matchesCategory && matchesPrice && inStock;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriceRange({ min: 0, max: 10000 });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Products</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>
      
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search products by name, SKU, or description..."
        />
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Categories</option>
                <option value="laptop">Laptops</option>
                <option value="component">Components</option>
                <option value="course">Course Materials</option>
                <option value="accessory">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 10000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.filter(p => p.stock > 0).length} products
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {product.category}
              </span>
            </div>
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <p className="text-lg font-bold text-blue-600">${product.sellingPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-3">Stock: {product.stock}</p>
            <Button
              onClick={() => onAddToCart(product.id)}
              size="sm"
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear filters to see all products
          </button>
        </div>
      )}
    </Card>
  );
}
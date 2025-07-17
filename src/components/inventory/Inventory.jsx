import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';

export function Inventory() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your products, stock levels, and pricing</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />

      <ProductForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        product={editingProduct}
        suppliers={suppliers}
        onSubmit={editingProduct ? updateProduct : addProduct}
      />
    </div>
  );
}
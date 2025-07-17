import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus } from 'lucide-react';
import { ActionButton } from '../common/ActionButton';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';

export function Inventory() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct } = useInventory();
  const { canModify } = useAuth();
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
    if (!canModify('inventory')) return;
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (!canModify('inventory')) return;
    deleteProduct(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your products, stock levels, and pricing</p>
        </div>
        <ActionButton module="inventory" onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Product
        </ActionButton>
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
        onDelete={handleDelete}
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
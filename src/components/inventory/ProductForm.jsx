import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function ProductForm({ isOpen, onClose, product, suppliers, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'component',
    sku: '',
    description: '',
    buyingPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    supplierId: '',
    warrantyPeriod: 12
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        sku: product.sku,
        description: product.description,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        minStock: product.minStock,
        supplierId: product.supplierId,
        warrantyPeriod: product.warrantyPeriod
      });
    } else {
      setFormData({
        name: '',
        category: 'component',
        sku: '',
        description: '',
        buyingPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        supplierId: '',
        warrantyPeriod: 12
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      onSubmit(product.id, formData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="laptop">Laptop</option>
            <option value="component">Component</option>
            <option value="course">Course Material</option>
            <option value="accessory">Accessory</option>
          </Select>
          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            required
          />
          <Select
            label="Supplier"
            value={formData.supplierId}
            onChange={(e) => handleChange('supplierId', e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </Select>
          <Input
            label="Buying Price"
            type="number"
            step="0.01"
            value={formData.buyingPrice}
            onChange={(e) => handleChange('buyingPrice', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Selling Price"
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) => handleChange('sellingPrice', parseFloat(e.target.value))}
            required
          />
          <Input
            label="Current Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value))}
            required
          />
          <Input
            label="Minimum Stock"
            type="number"
            value={formData.minStock}
            onChange={(e) => handleChange('minStock', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <Input
          label="Warranty Period (months)"
          type="number"
          value={formData.warrantyPeriod}
          onChange={(e) => handleChange('warrantyPeriod', parseInt(e.target.value))}
          required
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
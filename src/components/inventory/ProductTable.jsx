import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { calculateProfitMargin } from '../../utils/helpers';

export function ProductTable({ products, onEdit, onDelete }) {
  const { canModify } = useAuth();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Buying Price</TableHead>
          <TableHead>Selling Price</TableHead>
          <TableHead>Profit %</TableHead>
          {canModify('inventory') && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={product.category} />
            </TableCell>
            <TableCell>
              <span className="font-mono text-sm text-gray-900 dark:text-white">{product.sku}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {product.stock}
                </span>
                {product.stock <= product.minStock && (
                  <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-gray-900 dark:text-white">${product.buyingPrice.toFixed(2)}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-900 dark:text-white">${product.sellingPrice.toFixed(2)}</span>
            </TableCell>
            <TableCell>
              <span className="font-medium text-green-600 dark:text-green-400">
                {calculateProfitMargin(product.sellingPrice, product.buyingPrice)}%
              </span>
            </TableCell>
            {canModify('inventory') && (
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
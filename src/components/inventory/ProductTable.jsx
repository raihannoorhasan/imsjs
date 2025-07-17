import React from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { calculateProfitMargin } from '../../utils/helpers';

export function ProductTable({ products, onEdit, onDelete }) {
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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={product.category} />
            </TableCell>
            <TableCell>
              <span className="font-mono text-sm">{product.sku}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                  {product.stock}
                </span>
                {product.stock <= product.minStock && (
                  <AlertCircle size={16} className="text-red-500" />
                )}
              </div>
            </TableCell>
            <TableCell>${product.buyingPrice.toFixed(2)}</TableCell>
            <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
            <TableCell>
              <span className="font-medium text-green-600">
                {calculateProfitMargin(product.sellingPrice, product.buyingPrice)}%
              </span>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
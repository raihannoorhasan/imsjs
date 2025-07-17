import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Card } from '../common/Card';

export function Cart({ cart, products, onUpdateQuantity, onRemoveFromCart }) {
  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <ShoppingCart size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
      </div>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Cart is empty</p>
      ) : (
        <div className="space-y-3">
          {cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            
            return (
              <div key={item.productId} className="flex items-center justify-between border-b pb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-gray-600 text-xs">${item.unitPrice.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium text-gray-900 min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
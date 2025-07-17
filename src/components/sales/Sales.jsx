import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '../common/Button';
import { ProductSelection } from './ProductSelection';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
import { CustomerForm } from './CustomerForm';

export function Sales() {
  const { products, customers, addSale, addCustomer, generateInvoice } = useInventory();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        ));
      }
    } else {
      setCart([...cart, {
        productId,
        quantity: 1,
        unitPrice: product.sellingPrice,
        total: product.sellingPrice
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.stock) return;

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax - discount;

  const handleSale = () => {
    if (cart.length === 0 || !selectedCustomer) return;

    const saleData = {
      customerId: selectedCustomer,
      items: cart,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'completed'
    };

    addSale(saleData);
    
    // Clear cart
    setCart([]);
    setDiscount(0);
    
    // Generate invoice
    setTimeout(() => {
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      const latestSale = sales[sales.length - 1];
      if (latestSale) {
        generateInvoice(latestSale.id);
      }
    }, 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales & POS</h1>
        <p className="text-gray-600 mt-2">Process sales and manage point of sale operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductSelection products={products} onAddToCart={addToCart} />
        </div>

        <div className="space-y-6">
          <Cart 
            cart={cart}
            products={products}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
          />

          {cart.length > 0 && (
            <Checkout
              customers={customers}
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              discount={discount}
              onDiscountChange={setDiscount}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onSale={handleSale}
              onShowCustomerForm={() => setShowCustomerForm(true)}
            />
          )}
        </div>
      </div>

      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={addCustomer}
      />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, ShoppingCart, Search, X, Calculator, CreditCard, DollarSign, Receipt, User, Package, FileText, CheckCircle, Printer } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { CustomerForm } from './CustomerForm';
import { QuickActions } from './QuickActions';
import { SalesHistory } from './SalesHistory';

export function Sales() {
  const { products, customers, addSale, addCustomer, generateInvoice } = useInventory();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('amount'); // 'amount' or 'percentage'
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('pos');
  const [amountReceived, setAmountReceived] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const inStock = product.stock > 0;
    return matchesSearch && matchesCategory && inStock;
  });

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

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setAmountReceived(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  
  // Calculate discount
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount / 100) 
    : discount;
  
  const total = subtotal + tax - discountAmount;
  const change = amountReceived - total;

  const handleSale = () => {
    if (cart.length === 0 || !selectedCustomer) return;

    const saleData = {
      customerId: selectedCustomer,
      items: cart,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      amountReceived,
      change: Math.max(0, change),
      status: 'completed'
    };

    addSale(saleData);
    
    // Generate invoice
    setTimeout(() => {
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      const latestSale = sales[sales.length - 1];
      if (latestSale) {
        generateInvoice(latestSale.id);
        setCompletedSale(latestSale);
        
        // Get the generated invoice
        setTimeout(() => {
          const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
          const latestInvoice = invoices[invoices.length - 1];
          setGeneratedInvoice(latestInvoice);
          setShowSuccessModal(true);
        }, 100);
      }
    }, 100);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCompletedSale(null);
    setGeneratedInvoice(null);
    
    // Clear everything after modal is closed
    clearCart();
    setSelectedCustomer('');
    setPaymentMethod('cash');
  };

  const handlePrintInvoice = () => {
    if (generatedInvoice) {
      // Create a simple invoice print layout
      const printWindow = window.open('', '_blank');
      const customer = customers.find(c => c.id === completedSale?.customerId);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${generatedInvoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
              .invoice-details { margin: 20px 0; }
              .customer-info { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .totals { margin-top: 20px; text-align: right; }
              .total-row { font-weight: bold; font-size: 18px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">Hi Tech Computer</div>
              <p>Professional Computer Solutions</p>
            </div>
            
            <div class="invoice-details">
              <h2>Invoice: ${generatedInvoice.invoiceNumber}</h2>
              <p>Date: ${new Date(completedSale?.createdAt).toLocaleDateString()}</p>
              <p>Sale ID: #${completedSale?.id.slice(-6)}</p>
            </div>
            
            <div class="customer-info">
              <h3>Bill To:</h3>
              <p><strong>${customer?.name || 'Unknown Customer'}</strong></p>
              <p>${customer?.email || ''}</p>
              <p>${customer?.phone || ''}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${completedSale?.items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return `
                    <tr>
                      <td>${product?.name || 'Unknown Product'}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.unitPrice.toFixed(2)}</td>
                      <td>$${item.total.toFixed(2)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <p>Subtotal: $${completedSale?.subtotal.toFixed(2)}</p>
              <p>Tax: $${completedSale?.tax.toFixed(2)}</p>
              ${completedSale?.discount > 0 ? `<p>Discount: -$${completedSale.discount.toFixed(2)}</p>` : ''}
              <p class="total-row">Total: $${completedSale?.total.toFixed(2)}</p>
              ${completedSale?.paymentMethod === 'cash' ? `
                <p>Amount Received: $${completedSale.amountReceived.toFixed(2)}</p>
                <p>Change: $${(completedSale.change || 0).toFixed(2)}</p>
              ` : ''}
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  const tabs = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'history', label: 'Sales History', icon: Receipt }
  ];

  if (activeTab === 'history') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <SalesHistory />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
            <p className="text-gray-600">Fast and efficient checkout system</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <QuickActions onClearCart={clearCart} />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Category Filters */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'laptop', 'component', 'course', 'accessory'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product.id)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 mx-auto">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">${product.sellingPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        product.category === 'laptop' ? 'bg-purple-100 text-purple-800' :
                        product.category === 'component' ? 'bg-blue-100 text-blue-800' :
                        product.category === 'course' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Package className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          <p className="text-sm text-green-600 font-medium">${item.unitPrice.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="font-medium text-gray-900 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-gray-900">${item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <div className="flex space-x-2">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => setShowCustomerForm(true)}
                    className="px-3"
                  >
                    <User size={16} />
                  </Button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: DollarSign },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'transfer', label: 'Transfer', icon: Calculator }
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-medium transition-colors ${
                          paymentMethod === method.id 
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                            : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={16} className="mb-1" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="amount">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              {/* Amount Received (for cash payments) */}
              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                {paymentMethod === 'cash' && amountReceived > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Change:</span>
                    <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(change).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Sale Button */}
              <Button
                onClick={handleSale}
                disabled={!selectedCustomer || (paymentMethod === 'cash' && amountReceived < total)}
                variant="success"
                className="w-full py-3 text-lg font-semibold"
              >
                <Receipt className="w-5 h-5 mr-2" />
                Complete Sale
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleCloseSuccessModal}
        title="Sale Completed Successfully!"
        size="md"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sale #{completedSale?.id.slice(-6)} Completed
            </h3>
            <p className="text-gray-600">
              Invoice {generatedInvoice?.invoiceNumber} has been generated automatically
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer:</p>
                <p className="font-medium">{customers.find(c => c.id === completedSale?.customerId)?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount:</p>
                <p className="font-medium text-green-600">{formatCurrency(completedSale?.total || 0)}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-medium capitalize">{completedSale?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-600">Items:</p>
                <p className="font-medium">{completedSale?.items.length} items</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handlePrintInvoice}
              variant="outline"
              className="flex-1"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
            <Button 
              onClick={handleCloseSuccessModal}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            You can also find this invoice in the Invoices section
          </p>
        </div>
      </Modal>
      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        onSubmit={addCustomer}
      />
    </div>
  );
}
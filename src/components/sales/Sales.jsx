import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Plus, ShoppingCart, Search, X, Calculator, CreditCard, DollarSign, Receipt, User, Package, FileText, CheckCircle, Printer, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { CustomerForm } from './CustomerForm';
import { QuickActions } from './QuickActions';
import { SalesHistory } from './SalesHistory';

export function Sales() {
  const { products, customers, addSale, addCustomer, generateInvoice, serviceTickets } = useInventory();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedServiceTicket, setSelectedServiceTicket] = useState('');
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

  // Get service tickets for selected customer
  const getCustomerServiceTickets = () => {
    if (!selectedCustomer) return [];
    return serviceTickets.filter(ticket => 
      ticket.customerId === selectedCustomer && 
      !['completed', 'delivered', 'cancelled'].includes(ticket.status)
    );
  };

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
    setSelectedServiceTicket('');
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
    if (cart.length === 0) return;

    // For service payments, customer must be selected
    if (paymentMethod === 'service_payment' && !selectedCustomer) {
      alert('Please select a customer for service payments');
      return;
    }
    
    if (paymentMethod === 'service_payment' && !selectedServiceTicket) {
      alert('Please select a service ticket');
      return;
    }

    // Use guest customer if no customer is selected (except for service payments)
    const customerId = selectedCustomer || (paymentMethod === 'service_payment' ? null : 'guest');
    
    if (!customerId) {
      alert('Customer selection is required for service payments');
      return;
    }

    const saleData = {
      customerId,
      items: cart,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      amountReceived,
      change: Math.max(0, change),
      status: paymentMethod === 'service_payment' ? 'pending' : 'completed',
      serviceTicketId: paymentMethod === 'service_payment' ? selectedServiceTicket : null,
      linkedToService: paymentMethod === 'service_payment'
    };

    addSale(saleData);
    
    // Only generate invoice for completed sales
    if (paymentMethod !== 'service_payment') {
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
    } else {
      // For service payments, show different success message
      setTimeout(() => {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        const latestSale = sales[sales.length - 1];
        if (latestSale) {
          setCompletedSale(latestSale);
          setShowSuccessModal(true);
        }
      }, 100);
    }
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
      const customerName = completedSale?.customerId === 'guest' ? 'Guest Customer' : (customer?.name || 'Unknown Customer');
      const customerEmail = completedSale?.customerId === 'guest' ? '' : (customer?.email || '');
      const customerPhone = completedSale?.customerId === 'guest' ? '' : (customer?.phone || '');
      
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
              <p><strong>${customerName}</strong></p>
              ${customerEmail ? `<p>${customerEmail}</p>` : ''}
              ${customerPhone ? `<p>${customerPhone}</p>` : ''}
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fast and efficient checkout system</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <QuickActions onClearCart={clearCart} />
            <QuickActions onClearCart={clearCart} hasItems={cart.length > 0} />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <div className="h-full flex flex-col">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                        ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product.id)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 group min-h-[180px] md:min-h-[200px] flex flex-col"
                  >
                    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                      <Package className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center mb-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm mb-2 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">SKU: {product.sku}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-lg font-bold text-green-600 dark:text-green-400">${product.sellingPrice.toFixed(2)}</span>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">Stock</span>
                          <span className={`text-sm font-semibold ${
                            product.stock <= product.minStock 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize w-full justify-center ${
                        product.category === 'laptop' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                        product.category === 'component' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                        product.category === 'course' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {product.category}
                      </span>
                      
                      {product.stock <= product.minStock && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-1 md:p-2">
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">Low Stock!</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 pb-6">
                  <Package className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No products found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cart</h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-800"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium dark:text-gray-400">Cart is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex-shrink-0">
                          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1">{product.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">SKU: {product.sku}</p>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  product.category === 'laptop' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                                  product.category === 'component' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                                  product.category === 'course' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}>
                                  {product.category}
                                </span>
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">${item.unitPrice.toFixed(2)} each</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-300 font-bold">-</span>
                          </button>
                          <div className="bg-white dark:bg-gray-600 px-3 py-1 rounded-lg min-w-[45px] text-center border border-gray-200 dark:border-gray-500">
                            <span className="font-bold text-gray-900 dark:text-white">
                            {item.quantity}
                            </span>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-300 font-bold">+</span>
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 dark:text-white text-lg">${item.total.toFixed(2)}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer</label>
                <div className="flex space-x-2">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => setShowCustomerForm(true)}
                    className="px-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    <User size={16} />
                  </Button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'cash', label: 'Cash', icon: DollarSign },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'transfer', label: 'Transfer', icon: Calculator },
                    { id: 'service_payment', label: 'Service Payment', icon: Calculator }
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 shadow-sm ${
                          paymentMethod === method.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 shadow-md transform scale-105' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
                  >
                    <option value="amount">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              {/* Amount Received (for cash payments) */}
              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
                  />
                </div>
              )}

              {/* Service Ticket Selection (for service payments) */}
              {paymentMethod === 'service_payment' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Ticket</label>
                  <select
                    value={selectedServiceTicket}
                    onChange={(e) => setSelectedServiceTicket(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors duration-200"
                    required
                  >
                    <option value="">Select Service Ticket</option>
                    {getCustomerServiceTickets().map(ticket => (
                      <option key={ticket.id} value={ticket.id}>
                        {ticket.ticketNumber} - {ticket.deviceBrand} {ticket.deviceModel}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && getCustomerServiceTickets().length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      No active service tickets found for this customer
                    </p>
                  )}
                </div>
              )}

              {/* Totals */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-green-600 dark:text-green-400">${total.toFixed(2)}</span>
                  </div>
                </div>
                {paymentMethod === 'cash' && amountReceived > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Change:</span>
                    <span className={change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      <span className="font-medium">${Math.abs(change).toFixed(2)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Sale Button */}
              <Button
                onClick={handleSale}
                disabled={cart.length === 0 || 
                         (paymentMethod === 'cash' && amountReceived < total) ||
                         (paymentMethod === 'service_payment' && !selectedServiceTicket)}
                variant="success"
                className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Receipt className="w-5 h-5 mr-2" />
                Complete Sale
              </Button>
              
              {!selectedCustomer && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {paymentMethod === 'service_payment' 
                    ? 'Customer selection required for service payments'
                    : 'No customer selected - sale will be processed as guest purchase'
                  }
                </p>
              )}
              
              {paymentMethod === 'service_payment' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 This sale will be marked as pending and linked to the service ticket. 
                    Payment will be completed when the customer pays through the service system.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleCloseSuccessModal}
        title={completedSale?.status === 'pending' ? "Sale Created - Pending Payment" : "Sale Completed Successfully!"}
        size="md"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${completedSale?.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>
              {completedSale?.status === 'pending' ? (
                <Clock className="w-12 h-12 text-yellow-600" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-600" />
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sale #{completedSale?.id.slice(-6)} {completedSale?.status === 'pending' ? 'Created' : 'Completed'}
            </h3>
            <p className="text-gray-600">
              {completedSale?.status === 'pending' 
                ? 'Sale is pending payment through service ticket'
                : `Invoice ${generatedInvoice?.invoiceNumber} has been generated automatically`
              }
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Customer:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {completedSale?.customerId === 'guest' 
                    ? 'Guest Customer' 
                    : customers.find(c => c.id === completedSale?.customerId)?.name || 'Unknown Customer'
                  }
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Amount:</p>
                <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(completedSale?.total || 0)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Method:</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{completedSale?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Items:</p>
                <p className="font-medium text-gray-900 dark:text-white">{completedSale?.items.length} items</p>
              </div>
              {completedSale?.serviceTicketId && (
                <>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Service Ticket:</p>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {serviceTickets.find(t => t.id === completedSale.serviceTicketId)?.ticketNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status:</p>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">Pending Payment</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            {completedSale?.status !== 'pending' && (
              <Button 
                onClick={handlePrintInvoice}
                variant="outline"
                className="flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Invoice
              </Button>
            )}
            <Button 
              onClick={handleCloseSuccessModal}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {completedSale?.status === 'pending' 
              ? 'You can track this sale in the Sales History and complete payment through Service Payments'
              : 'You can also find this invoice in the Invoices section'
            }
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
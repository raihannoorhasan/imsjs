// Generate unique ID
export const generateId = () => Date.now().toString();

// Generate invoice number
export const generateInvoiceNumber = () => `INV-${Date.now()}`;

// Generate service ticket number
export const generateTicketNumber = () => `ST-${Date.now()}`;

// Generate service invoice number
export const generateServiceInvoiceNumber = () => `SRV-${Date.now()}`;

// Format currency
export const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

// Format date
export const formatDate = (date) => new Date(date).toLocaleDateString();

// Format date and time
export const formatDateTime = (date) => new Date(date).toLocaleString();

// Calculate profit margin
export const calculateProfitMargin = (sellingPrice, buyingPrice) => {
  if (buyingPrice === 0) return 0;
  return ((sellingPrice - buyingPrice) / buyingPrice * 100).toFixed(1);
};

// Get status color classes
export const getStatusColor = (status) => {
  const statusColors = {
    received: 'bg-blue-100 text-blue-800',
    diagnosed: 'bg-yellow-100 text-yellow-800',
    waiting_approval: 'bg-orange-100 text-orange-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    sent: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Get priority color classes
export const getPriorityColor = (priority) => {
  const priorityColors = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Calculate tax
export const calculateTax = (amount, taxRate = 0.1) => amount * taxRate;

// Calculate total with tax and discount
export const calculateTotal = (subtotal, taxRate = 0.1, discount = 0) => {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax - discount;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format status text
export const formatStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return '';
  }
  return status.replace(/_/g, ' ').split(' ').map(capitalize).join(' ');
};
import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  User, 
  FileText, 
  ShoppingCart, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  Info,
  Receipt,
  Package
} from 'lucide-react';
import { generateId, formatCurrency } from '../../utils/helpers';

export function ServicePaymentForm({ isOpen, onClose, onSubmit, preSelectedTicket }) {
  const { customers, serviceTickets, sales, products, updateStock, technicians } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTicketId: '',
    relatedSaleId: '',
    completePendingSale: false,
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    paymentType: 'service_charge',
    autoCalculateFromSale: false,
    autoFillFromPendingSales: false
  });
  const [selectedSale, setSelectedSale] = useState(null);
  const [pendingSalesTotal, setPendingSalesTotal] = useState(0);

  // Pre-select ticket if provided
  React.useEffect(() => {
    if (preSelectedTicket && isOpen) {
      setFormData(prev => ({
        ...prev,
        customerId: preSelectedTicket.customerId,
        serviceTicketId: preSelectedTicket.id
      }));
      
      // Calculate pending sales for this ticket
      const pendingSales = sales.filter(s => 
        s.serviceTicketId === preSelectedTicket.id && 
        s.status === 'pending'
      );
      const total = pendingSales.reduce((sum, sale) => sum + sale.total, 0);
      setPendingSalesTotal(total);
      
      // Calculate advance payment info
      calculateAdvancePaymentInfo(preSelectedTicket);
    }
  }, [preSelectedTicket, isOpen, sales]);

  const calculateAdvancePaymentInfo = (ticket) => {
    // Get all approved advance payments for this ticket
    const advancePayments = servicePayments.filter(p => 
      p.serviceTicketId === ticket.id && 
      p.paymentType === 'advance_payment' && 
      p.status === 'approved'
    );
    
    const totalAdvance = advancePayments.reduce((sum, p) => sum + p.amount, 0);
    const totalServiceCost = ticket.laborCost + ticket.partsCost;
    const remainingBalance = totalServiceCost - totalAdvance;
    
    setAdvancePaymentInfo({
      totalAdvance,
      totalServiceCost,
      remainingBalance,
      hasAdvance: totalAdvance > 0,
      needsRefund: remainingBalance < 0,
      isFullyPaid: remainingBalance <= 0
    });
  };
  const [advancePaymentInfo, setAdvancePaymentInfo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const receiptNumber = `SR-${generateId()}`;
    
    onSubmit({
      ...formData,
      receiptNumber,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount),
      status: 'pending',
      pendingSalesToComplete: formData.completePendingSale ? pendingSalesForTicket.map(s => s.id) : [],
      createdAt: new Date()
    });
    
    setFormData({
      customerId: '',
      serviceTicketId: '',
      relatedSaleId: '',
      completePendingSale: false,
      amount: 0,
      paymentMethod: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Admin',
      notes: '',
      paymentType: 'service_charge',
      autoCalculateFromSale: false,
      autoFillFromPendingSales: false
    });
    setPendingSalesTotal(0);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill customer when ticket is selected
    if (field === 'serviceTicketId') {
      const ticket = serviceTickets.find(t => t.id === value);
      if (ticket) {
        setFormData(prev => ({ 
          ...prev, 
          customerId: ticket.customerId,
          // Auto-suggest parts cost if available
          amount: prev.paymentType === 'parts_payment' ? ticket.partsCost : prev.amount
        }));
        
        // Calculate total from pending sales for this ticket
        const pendingSales = sales.filter(s => 
          s.serviceTicketId === value && 
          s.status === 'pending'
        );
        const total = pendingSales.reduce((sum, sale) => sum + sale.total, 0);
        setPendingSalesTotal(total);
      }
    }
    
    // Handle auto-fill from pending sales checkbox
    if (field === 'completePendingSale') {
      if (value && pendingSalesForTicket.length > 0) {
        const totalAmount = pendingSalesForTicket.reduce((sum, sale) => sum + sale.total, 0);
        setFormData(prev => ({
          ...prev,
          paymentType: 'parts_payment',
          amount: totalAmount,
          notes: `Parts payment for ${pendingSalesForTicket.length} POS sale(s) - Total: ${formatCurrency(totalAmount)}`,
          autoFillFromPendingSales: true
        }));
      } else if (!value && formData.autoFillFromPendingSales) {
        // Reset when unchecked
        setFormData(prev => ({
          ...prev,
          paymentType: 'service_charge',
          amount: 0,
          notes: '',
          autoFillFromPendingSales: false
        }));
      }
    }
    
    // Handle sale selection for parts payment
    if (field === 'relatedSaleId') {
      const sale = sales.find(s => s.id === value);
      setSelectedSale(sale);
      if (sale && formData.paymentType === 'parts_payment') {
        setFormData(prev => ({ 
          ...prev, 
          amount: sale.total,
          notes: `Parts payment for sale #${sale.id.slice(-6)} - ${sale.items.length} item(s)`
        }));
      }
    }
    
    // Handle payment type change
    if (field === 'paymentType') {
      if (value === 'parts_payment' && formData.serviceTicketId) {
        const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
        if (ticket && ticket.partsCost > 0 && !formData.autoFillFromPendingSales) {
          setFormData(prev => ({ ...prev, amount: ticket.partsCost }));
        }
      } else if (value === 'labor_payment' && formData.serviceTicketId) {
        const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
        if (ticket && ticket.laborCost > 0) {
          setFormData(prev => ({ ...prev, amount: ticket.laborCost }));
        }
      } else if (value === 'advance_payment' && formData.serviceTicketId) {
        // For advance payment, suggest remaining balance if available
        if (advancePaymentInfo && advancePaymentInfo.remainingBalance > 0) {
          setFormData(prev => ({ ...prev, amount: advancePaymentInfo.remainingBalance }));
        }
      }
    }
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    !['cancelled'].includes(t.status)
  );
  
  // Get sales for the selected customer (for parts payment)
  const customerSales = sales.filter(s => {
    // For parts payment, only show sales linked to this specific service ticket
    if (formData.paymentType === 'parts_payment') {
      return s.serviceTicketId === formData.serviceTicketId && 
             (s.status === 'completed' || s.status === 'pending');
    }
    // For other payment types, show all customer sales
    return s.customerId === formData.customerId && 
           (s.status === 'completed' || s.status === 'pending');
  });
  
  // Get pending sales linked to the selected service ticket
  const pendingSalesForTicket = sales.filter(s => 
    s.serviceTicketId === formData.serviceTicketId && 
    s.status === 'pending'
  );
  
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const getSaleDescription = (sale) => {
    const itemCount = sale.items.length;
    const firstItem = sale.items[0];
    const productName = firstItem ? getProductName(firstItem.productId) : 'Unknown';
    const statusText = sale.status === 'pending' ? ' [PENDING]' : '';
    return `Sale #${sale.id.slice(-6)} - ${productName}${itemCount > 1 ? ` +${itemCount - 1} more` : ''} ($${sale.total.toFixed(2)})${statusText}`;
  };

  const getTicketInfo = () => {
    return serviceTickets.find(t => t.id === formData.serviceTicketId);
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
    { id: 'transfer', label: 'Bank Transfer', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200' },
    { id: 'check', label: 'Check', icon: Receipt, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' }
  ];

  const paymentTypes = [
    { id: 'service_charge', label: 'Service Charge', icon: Wrench, description: 'General service fees' },
    { id: 'advance_payment', label: 'Advance Payment', icon: DollarSign, description: 'Payment in advance' },
    { id: 'parts_payment', label: 'Parts Payment', icon: Package, description: 'Payment for parts used' },
    { id: 'labor_payment', label: 'Labor Payment', icon: User, description: 'Payment for labor costs' },
    { id: 'diagnostic_fee', label: 'Diagnostic Fee', icon: AlertCircle, description: 'Device diagnosis fee' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Record Service Payment</h2>
            <p className="text-sm text-gray-600">Process customer payments for service work</p>
          </div>
        </div>
      }
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer & Service Selection */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Customer & Service Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service Ticket</label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={formData.serviceTicketId}
                  onChange={(e) => handleChange('serviceTicketId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  required
                  disabled={!formData.customerId}
                >
                  <option value="">Select Service Ticket</option>
                  {customerTickets.map(ticket => (
                    <option key={ticket.id} value={ticket.id}>
                      {ticket.ticketNumber} - {ticket.deviceBrand} {ticket.deviceModel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Sales Auto-fill Section */}
        {pendingSalesForTicket.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="completePendingSale"
                    checked={formData.completePendingSale}
                    onChange={(e) => handleChange('completePendingSale', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="completePendingSale" className="text-lg font-semibold text-amber-900 cursor-pointer">
                    Complete Pending POS Sales
                  </label>
                  <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Auto-fill Payment
                  </div>
                </div>
                
                <p className="text-amber-800 mb-4">
                  This service ticket has <span className="font-semibold">{pendingSalesForTicket.length} pending POS sale(s)</span> totaling{' '}
                  <span className="font-bold text-lg">{formatCurrency(pendingSalesTotal)}</span>. 
                  Check this to automatically fill payment details and mark sales as completed when approved.
                </p>
                
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Pending Sales Details
                  </h4>
                  <div className="space-y-2">
                    {pendingSalesForTicket.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-1 rounded">
                            <Receipt className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-amber-900">Sale #{sale.id.slice(-6)}</p>
                            <p className="text-sm text-amber-700">{sale.items.length} item(s)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-900">{formatCurrency(sale.total)}</p>
                          <p className="text-xs text-amber-600">PENDING</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.completePendingSale && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">Auto-fill Active</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Payment type set to "Parts Payment" and amount auto-filled to {formatCurrency(pendingSalesTotal)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Type Selection */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Payment Type</h3>
            {formData.autoFillFromPendingSales && (
              <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                AUTO-FILLED
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {paymentTypes.map(type => {
              const Icon = type.icon;
              const isSelected = formData.paymentType === type.id;
              const isDisabled = formData.autoFillFromPendingSales;
              
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => !isDisabled && handleChange('paymentType', type.id)}
                  disabled={isDisabled}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-100 shadow-md transform scale-105'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                  </div>
                  <p className={`text-sm ${isSelected ? 'text-purple-700' : 'text-gray-500'}`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Related Sale Selection for Parts Payment */}
        {formData.paymentType === 'parts_payment' && customerSales.length > 0 && !formData.autoFillFromPendingSales && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-900">Related Sale (Optional)</h3>
            </div>
            
            <div className="relative">
              <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={formData.relatedSaleId}
                onChange={(e) => handleChange('relatedSaleId', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="">Select related sale</option>
                {customerSales.map(sale => (
                  <option key={sale.id} value={sale.id}>
                    {getSaleDescription(sale)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Payment Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Amount
                {formData.autoFillFromPendingSales && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AUTO-CALCULATED</span>
                )}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  disabled={formData.autoFillFromPendingSales}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-lg font-semibold ${
                    formData.autoFillFromPendingSales 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="0.00"
                  required
                />
              </div>
              {formData.autoFillFromPendingSales && (
                <p className="text-sm text-green-600 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Amount calculated from pending POS sales
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Payment Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = formData.paymentMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleChange('paymentMethod', method.id)}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                    isSelected
                      ? `${method.bgColor} border-current shadow-md transform scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? method.color : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${isSelected ? method.color : 'text-gray-700'}`}>
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Received By</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.receivedBy}
                  onChange={(e) => handleChange('receivedBy', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white shadow-sm"
                  placeholder="Staff member name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Notes
                {formData.autoFillFromPendingSales && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AUTO-GENERATED</span>
                )}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  disabled={formData.autoFillFromPendingSales}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm resize-none ${
                    formData.autoFillFromPendingSales 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'bg-white border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Additional payment notes..."
                />
              </div>
              {formData.autoFillFromPendingSales && (
                <p className="text-sm text-blue-600 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Notes auto-generated from pending sales
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Service Ticket Info Display */}
        {(formData.paymentType === 'parts_payment' || formData.paymentType === 'labor_payment') && formData.serviceTicketId && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {formData.paymentType === 'parts_payment' ? 'Parts Payment Information' : 'Labor Payment Information'}
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
                    const cost = formData.paymentType === 'parts_payment' ? ticket?.partsCost : ticket?.laborCost;
                    const costType = formData.paymentType === 'parts_payment' ? 'parts' : 'labor';
                    
                    if (ticket && cost > 0) {
                      return (
                        <p className="text-blue-800">
                          Service ticket has existing {costType} cost of{' '}
                          <span className="font-bold">${cost.toFixed(2)}</span>
                        </p>
                      );
                    }
                    return (
                      <p className="text-blue-800">
                        Recording payment for {costType} {formData.paymentType === 'parts_payment' ? 'used in this service' : 'charges'}
                      </p>
                    );
                  })()}
                  
                  {selectedSale && (
                    <div className="bg-white border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-blue-900 font-medium">Linked to Sale:</p>
                      <p className="text-blue-700">{getSaleDescription(selectedSale)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Payment will be marked as pending and require admin approval
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-3"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              disabled={formData.paymentType === 'parts_payment' && customerSales.length === 0}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
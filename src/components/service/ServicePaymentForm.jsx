import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { } from 'lucide-react';
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
  Package,
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
  Calculator,
  Edit2, Plus, X 
} from 'lucide-react';
import { generateId, formatCurrency } from '../../utils/helpers';

export function ServicePaymentForm({ isOpen, onClose, onSubmit, preSelectedTicket }) {
  const { customers, serviceTickets, sales, products, updateStock, technicians, servicePayments } = useInventory();
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
    autoFillFromPendingSales: false,
    refundAmount: 0,
    isRefund: false
  });
  const [selectedSale, setSelectedSale] = useState(null);
  const [pendingSalesTotal, setPendingSalesTotal] = useState(0);
  const [advancePaymentInfo, setAdvancePaymentInfo] = useState(null);
  const [paymentCalculation, setPaymentCalculation] = useState(null);
  const [showExternalPartsForm, setShowExternalPartsForm] = useState(false);
  const [externalParts, setExternalParts] = useState([]);
  const [newPart, setNewPart] = useState({
    name: '',
    quantity: 1,
    unitPrice: 0,
    supplier: '',
    description: ''
  });

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
  }, [preSelectedTicket, isOpen, sales, servicePayments]);

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
    
    const info = {
      totalAdvance,
      totalServiceCost,
      remainingBalance,
      hasAdvance: totalAdvance > 0,
      needsRefund: remainingBalance < 0,
      isFullyPaid: remainingBalance <= 0,
      refundAmount: remainingBalance < 0 ? Math.abs(remainingBalance) : 0,
      advancePayments
    };
    
    setAdvancePaymentInfo(info);
    return info;
  };

  const calculatePaymentAmount = (paymentType, ticket, advanceInfo) => {
    if (!ticket || !advanceInfo) return 0;

    switch (paymentType) {
      case 'parts_payment':
        // For parts payment, calculate actual amount needed after advance
        const partsTotal = pendingSalesTotal + (externalParts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0));
        return Math.max(0, partsTotal - advanceInfo.totalAdvance);
      
      case 'labor_payment':
        // For labor payment, use remaining balance if positive, otherwise 0
        return Math.max(0, advanceInfo.remainingBalance);
      
      case 'final_payment':
        // For final payment, calculate remaining balance
        return Math.max(0, advanceInfo.remainingBalance);
      
      case 'refund':
        // For refund, return the overpaid amount
        return advanceInfo.needsRefund ? advanceInfo.refundAmount : 0;
      
      case 'advance_payment':
        // For new advance payment, suggest remaining balance if any
        return Math.max(0, advanceInfo.remainingBalance);
      
      default:
        return 0;
    }
  };

  const updatePaymentCalculation = (paymentType, amount, ticket, advanceInfo) => {
    if (!ticket || !advanceInfo) return;

    const calculation = {
      originalAmount: amount,
      advanceApplied: 0,
      finalAmount: amount,
      refundDue: 0,
      description: '',
      breakdown: []
    };

    switch (paymentType) {
      case 'parts_payment':
        calculation.advanceApplied = advanceInfo.totalAdvance;
        calculation.finalAmount = Math.max(0, advanceInfo.remainingBalance);
        calculation.description = `Total service cost ${formatCurrency(advanceInfo.totalServiceCost)} minus advance ${formatCurrency(advanceInfo.totalAdvance)}`;
        calculation.breakdown = [
          { label: 'Total Service Cost', amount: advanceInfo.totalServiceCost, type: 'charge' },
          { label: 'Advance Applied', amount: -advanceInfo.totalAdvance, type: 'credit' },
          { label: 'Amount Due', amount: calculation.finalAmount, type: 'total' }
        ];
        break;
      
      case 'labor_payment':
        calculation.advanceApplied = advanceInfo.totalAdvance;
        calculation.finalAmount = Math.max(0, advanceInfo.remainingBalance);
        calculation.description = `Total service cost ${formatCurrency(advanceInfo.totalServiceCost)} minus advance ${formatCurrency(advanceInfo.totalAdvance)}`;
        calculation.breakdown = [
          { label: 'Total Service Cost', amount: advanceInfo.totalServiceCost, type: 'charge' },
          { label: 'Advance Applied', amount: -advanceInfo.totalAdvance, type: 'credit' },
          { label: 'Amount Due', amount: calculation.finalAmount, type: 'total' }
        ];
        break;
      
      case 'final_payment':
        calculation.finalAmount = Math.max(0, advanceInfo.remainingBalance);
        calculation.advanceApplied = advanceInfo.totalAdvance;
        if (advanceInfo.needsRefund) {
          calculation.refundDue = advanceInfo.refundAmount;
          calculation.description = `Service fully paid. Refund due: ${formatCurrency(calculation.refundDue)}`;
        } else {
          calculation.description = `Final payment for remaining balance`;
        }
        calculation.breakdown = [
          { label: 'Total Service Cost', amount: advanceInfo.totalServiceCost, type: 'charge' },
          { label: 'Advance Paid', amount: -advanceInfo.totalAdvance, type: 'credit' },
          { label: 'Balance Due', amount: calculation.finalAmount, type: 'total' }
        ];
        break;
      
      case 'refund':
        if (advanceInfo.needsRefund) {
          calculation.finalAmount = advanceInfo.refundAmount;
          calculation.refundDue = advanceInfo.refundAmount;
          calculation.advanceApplied = advanceInfo.totalAdvance;
          calculation.description = `Refund for overpayment`;
          calculation.breakdown = [
            { label: 'Total Service Cost', amount: advanceInfo.totalServiceCost, type: 'charge' },
            { label: 'Total Advance Paid', amount: advanceInfo.totalAdvance, type: 'credit' },
            { label: 'Refund Amount', amount: calculation.refundDue, type: 'refund' }
          ];
        }
        break;
    }

    setPaymentCalculation(calculation);
  };

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
      paymentCalculation,
      advancePaymentInfo,
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
      autoFillFromPendingSales: false,
      refundAmount: 0,
      isRefund: false
    });
    setPendingSalesTotal(0);
    setPaymentCalculation(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill customer when ticket is selected
    if (field === 'serviceTicketId') {
      const ticket = serviceTickets.find(t => t.id === value);
      if (ticket) {
        setFormData(prev => ({ 
          ...prev, 
          customerId: ticket.customerId
        }));
        
        // Calculate advance payment info for this ticket
        const advanceInfo = calculateAdvancePaymentInfo(ticket);
        
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
        const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
        const externalPartsTotal = externalParts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);
        const totalPartsAmount = totalAmount + externalPartsTotal;
        const calculatedAmount = advancePaymentInfo ? 
          Math.max(0, totalPartsAmount - advancePaymentInfo.totalAdvance) : totalPartsAmount;
        
        setFormData(prev => ({
          ...prev,
          paymentType: 'parts_payment',
          amount: calculatedAmount,
          notes: `Parts payment: POS ${formatCurrency(totalAmount)}${externalPartsTotal > 0 ? ` + External ${formatCurrency(externalPartsTotal)}` : ''} = ${formatCurrency(totalPartsAmount)}${advancePaymentInfo?.hasAdvance ? `. Advance applied: ${formatCurrency(Math.min(advancePaymentInfo.totalAdvance, totalPartsAmount))}. Customer pays: ${formatCurrency(calculatedAmount)}` : ''}`,
          autoFillFromPendingSales: true
        }));
      } else if (!value && formData.autoFillFromPendingSales) {
        setFormData(prev => ({
          ...prev,
          paymentType: 'service_charge',
          amount: 0,
          notes: '',
          autoFillFromPendingSales: false
        }));
      }
    }
    
    // Handle payment type change with intelligent amount calculation
    if (field === 'paymentType') {
      const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
      if (ticket && advancePaymentInfo) {
        const calculatedAmount = calculatePaymentAmount(value, ticket, advancePaymentInfo);
        setFormData(prev => ({ 
          ...prev, 
          amount: calculatedAmount,
          isRefund: value === 'refund'
        }));
        
        // Update payment calculation
        updatePaymentCalculation(value, calculatedAmount, ticket, advancePaymentInfo);
      }
    }
    
    // Handle amount change to update calculations
    if (field === 'amount') {
      const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
      if (ticket && advancePaymentInfo) {
        updatePaymentCalculation(formData.paymentType, parseFloat(value) || 0, ticket, advancePaymentInfo);
      }
    }
  };

  const handleAddExternalPart = () => {
    if (!newPart.name.trim() || newPart.unitPrice <= 0) {
      alert('Please enter part name and valid price');
      return;
    }
    
    setExternalParts([...externalParts, {
      ...newPart,
      id: generateId(),
      total: newPart.quantity * newPart.unitPrice
    }]);
    
    setNewPart({
      name: '',
      quantity: 1,
      unitPrice: 0,
      supplier: '',
      description: ''
    });
    
    // Recalculate payment amount if auto-fill is active
    if (formData.completePendingSale && advancePaymentInfo) {
      const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
      const calculatedAmount = calculatePaymentAmount('parts_payment', ticket, advancePaymentInfo);
      setFormData(prev => ({ ...prev, amount: calculatedAmount }));
      updatePaymentCalculation('parts_payment', calculatedAmount, ticket, advancePaymentInfo);
    }
  };

  const handleRemoveExternalPart = (partId) => {
    setExternalParts(externalParts.filter(part => part.id !== partId));
    
    // Recalculate payment amount if auto-fill is active
    if (formData.completePendingSale && advancePaymentInfo) {
      const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
      const calculatedAmount = calculatePaymentAmount('parts_payment', ticket, advancePaymentInfo);
      setFormData(prev => ({ ...prev, amount: calculatedAmount }));
      updatePaymentCalculation('parts_payment', calculatedAmount, ticket, advancePaymentInfo);
    }
  };

  const handlePartChange = (field, value) => {
    setNewPart(prev => ({ ...prev, [field]: value }));
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    !['cancelled'].includes(t.status)
  );
  
  // Get sales for the selected customer (for parts payment)
  const customerSales = sales.filter(s => {
    if (formData.paymentType === 'parts_payment') {
      return s.serviceTicketId === formData.serviceTicketId && 
             (s.status === 'completed' || s.status === 'pending');
    }
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
    { id: 'final_payment', label: 'Final Payment', icon: CheckCircle, description: 'Complete remaining balance' },
    { id: 'refund', label: 'Refund', icon: ArrowLeftRight, description: 'Refund overpayment', color: 'text-red-600' },
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
            <p className="text-sm text-gray-600">Process customer payments with advance calculation</p>
          </div>
        </div>
      }
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer & Service Selection */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Customer & Service Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <select
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Ticket</label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <select
                  value={formData.serviceTicketId}
                  onChange={(e) => handleChange('serviceTicketId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
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

        {/* Advance Payment Status - Only show if customer has advance payments */}
        {formData.serviceTicketId && advancePaymentInfo && advancePaymentInfo.hasAdvance && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                  <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">Advance Payment Status</h3>
                  <div className="bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                    ACTIVE
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Wrench className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">Total Service Cost</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">{formatCurrency(advancePaymentInfo.totalServiceCost)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">Advance Paid</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(advancePaymentInfo.totalAdvance)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {advancePaymentInfo.remainingBalance > 0 ? (
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                      ) : advancePaymentInfo.remainingBalance < 0 ? (
                        <ArrowLeftRight className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      )}
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        {advancePaymentInfo.remainingBalance > 0 ? 'Balance Due' : 
                         advancePaymentInfo.remainingBalance < 0 ? 'Refund Due' : 'Fully Paid'}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      advancePaymentInfo.remainingBalance > 0 ? 'text-red-600 dark:text-red-400' :
                      advancePaymentInfo.remainingBalance < 0 ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {formatCurrency(Math.abs(advancePaymentInfo.remainingBalance))}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">Advance Payments</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{advancePaymentInfo.advancePayments.length}</p>
                  </div>
                </div>
                
                {/* Payment Status Messages */}
                {advancePaymentInfo.isFullyPaid && !advancePaymentInfo.needsRefund && (
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-green-800 dark:text-green-200 font-medium">Service Fully Paid</p>
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      All service charges have been paid through advance payments.
                    </p>
                  </div>
                )}
                
                {advancePaymentInfo.needsRefund && (
                  <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <ArrowLeftRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <p className="text-orange-800 dark:text-orange-200 font-medium">Refund Required</p>
                    </div>
                    <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                      Customer has overpaid by {formatCurrency(advancePaymentInfo.refundAmount)}. 
                      Select "Refund" payment type to process the refund.
                    </p>
                  </div>
                )}
                
                {advancePaymentInfo.hasAdvance && !advancePaymentInfo.isFullyPaid && (
                  <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-blue-800 dark:text-blue-200 font-medium">Partial Advance Payment</p>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                      Customer has paid {formatCurrency(advancePaymentInfo.totalAdvance)} in advance. 
                      Remaining balance: {formatCurrency(advancePaymentInfo.remainingBalance)}
                    </p>
                  </div>
                )}
                
                {/* Advance Payment History */}
                <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 dark:text-emerald-200 mb-3 flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Advance Payment History
                  </h4>
                  <div className="space-y-2">
                    {advancePaymentInfo.advancePayments.map((payment, index) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-100 dark:bg-emerald-800/50 p-1 rounded">
                            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-emerald-900 dark:text-emerald-200">{payment.receiptNumber}</p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                              {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-900 dark:text-emerald-200">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">ADVANCE</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Sales Auto-fill Section */}
        {pendingSalesForTicket.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="completePendingSale"
                    checked={formData.completePendingSale}
                    onChange={(e) => handleChange('completePendingSale', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-amber-300 dark:border-amber-600 rounded focus:ring-amber-500 bg-white dark:bg-gray-700"
                  />
                  <label htmlFor="completePendingSale" className="text-lg font-semibold text-amber-900 dark:text-amber-200 cursor-pointer">
                    Complete Pending POS Sales
                  </label>
                  <div className="bg-amber-200 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium">
                    Smart Calculation
                  </div>
                </div>
                
                <p className="text-amber-800 dark:text-amber-200 mb-4">
                  This service ticket has <span className="font-semibold">{pendingSalesForTicket.length} pending POS sale(s)</span> totaling{' '}
                  <span className="font-bold text-lg">{formatCurrency(pendingSalesTotal)}</span>. 
                  {advancePaymentInfo?.hasAdvance && (
                    <span className="block mt-2 text-sm">
                      💡 Customer has advance payment of {formatCurrency(advancePaymentInfo.totalAdvance)}. 
                      After applying advance to total service cost, customer needs to pay only {formatCurrency(Math.max(0, advancePaymentInfo.remainingBalance))} more.
                    </span>
                  )}
                </p>
                
                <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                    Pending Sales Details
                  </h4>
                  <div className="space-y-2">
                    {pendingSalesForTicket.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 dark:bg-amber-800/50 p-1 rounded">
                            <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-200">Sale #{sale.id.slice(-6)}</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">{sale.items.length} item(s)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-900 dark:text-amber-200">{formatCurrency(sale.total)}</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">PENDING</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* External Parts Section */}
                <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-amber-900 dark:text-amber-200 flex items-center">
                      <Wrench className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                      External Parts (Optional)
                    </h4>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowExternalPartsForm(!showExternalPartsForm)}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Part
                    </Button>
                  </div>
                  
                  {showExternalPartsForm && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Part name"
                          value={newPart.name}
                          onChange={(e) => handlePartChange('name', e.target.value)}
                          className="px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Supplier"
                          value={newPart.supplier}
                          onChange={(e) => handlePartChange('supplier', e.target.value)}
                          className="px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={newPart.quantity}
                          onChange={(e) => handlePartChange('quantity', parseInt(e.target.value) || 1)}
                          min="1"
                          className="px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Unit price"
                          value={newPart.unitPrice}
                          onChange={(e) => handlePartChange('unitPrice', parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          className="px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Description (optional)"
                        value={newPart.description}
                        onChange={(e) => handlePartChange('description', e.target.value)}
                        className="w-full mt-3 px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        rows={2}
                      />
                      <div className="flex justify-end mt-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddExternalPart}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Add Part
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {externalParts.length > 0 && (
                    <div className="space-y-2">
                      {externalParts.map(part => (
                        <div key={part.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-center space-x-3">
                            <div className="bg-amber-100 dark:bg-amber-800/50 p-1 rounded">
                              <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="font-medium text-amber-900 dark:text-amber-200">{part.name}</p>
                              <p className="text-sm text-amber-700 dark:text-amber-300">
                                {part.quantity} × {formatCurrency(part.unitPrice)} • {part.supplier}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="font-bold text-amber-900 dark:text-amber-200">{formatCurrency(part.total)}</p>
                              <p className="text-xs text-amber-600 dark:text-amber-400">EXTERNAL</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExternalPart(part.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="bg-amber-100 dark:bg-amber-800/30 border border-amber-300 dark:border-amber-700 rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-amber-900 dark:text-amber-200">External Parts Total:</span>
                          <span className="font-bold text-amber-900 dark:text-amber-200">
                            {formatCurrency(externalParts.reduce((sum, part) => sum + part.total, 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {formData.completePendingSale && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-green-800 dark:text-green-200 font-medium">Smart Calculation Active</p>
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      Payment type set to "Parts Payment" and amount calculated considering advance payments and external parts
                    </p>
                    {externalParts.length > 0 && (
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        Including {externalParts.length} external part(s) totaling {formatCurrency(externalParts.reduce((sum, part) => sum + part.total, 0))}
                      </p>
                    )}
                  </div>
                )}
                
                {externalParts.length > 0 && !formData.completePendingSale && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-blue-800 dark:text-blue-200 font-medium">External Parts Added</p>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                      {externalParts.length} external part(s) added. Total: {formatCurrency(externalParts.reduce((sum, part) => sum + part.total, 0))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Type Selection */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200">Payment Type</h3>
            {formData.autoFillFromPendingSales && (
              <div className="bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                AUTO-CALCULATED
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {paymentTypes.map(type => {
              const Icon = type.icon;
              const isSelected = formData.paymentType === type.id;
              const isDisabled = formData.autoFillFromPendingSales && type.id !== 'parts_payment';
              
              // Hide refund option if no refund is due
              if (type.id === 'refund' && (!advancePaymentInfo?.needsRefund)) {
                return null;
              }
              
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => !isDisabled && handleChange('paymentType', type.id)}
                  disabled={isDisabled}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? `border-purple-500 ${type.id === 'refund' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} shadow-md transform scale-105`
                      : isDisabled
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${
                      isSelected 
                        ? (type.id === 'refund' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400')
                        : (type.color || 'text-gray-500 dark:text-gray-400')
                    }`} />
                    <span className={`font-medium ${
                      isSelected 
                        ? (type.id === 'refund' ? 'text-red-900 dark:text-red-200' : 'text-purple-900 dark:text-purple-200')
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isSelected 
                      ? (type.id === 'refund' ? 'text-red-700 dark:text-red-300' : 'text-purple-700 dark:text-purple-300')
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Calculation Display */}
        {paymentCalculation && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
                <Calculator className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-200 mb-2">Payment Calculation</h3>
                <p className="text-cyan-800 dark:text-cyan-200 mb-4">{paymentCalculation.description}</p>
                
                <div className="bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4">
                  <div className="space-y-3">
                    {paymentCalculation.breakdown.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between py-2 ${
                        item.type === 'total' ? 'border-t border-gray-200 dark:border-gray-600 pt-3 font-bold' :
                        item.type === 'refund' ? 'border-t border-gray-200 dark:border-gray-600 pt-3 font-bold text-red-600 dark:text-red-400' :
                        ''
                      }`}>
                        <span className={`${
                          item.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                          item.type === 'refund' ? 'text-red-600 dark:text-red-400' :
                          'text-gray-700 dark:text-gray-300'
                        }`}>
                          {item.label}:
                        </span>
                        <span className={`font-medium ${
                          item.type === 'credit' ? 'text-green-600 dark:text-green-400' :
                          item.type === 'refund' ? 'text-red-600 dark:text-red-400' :
                          item.type === 'total' ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-900 dark:text-white'
                        }`}>
                          {item.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {paymentCalculation.refundDue > 0 && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ArrowLeftRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <p className="text-red-800 dark:text-red-200 font-medium">Refund Processing Required</p>
                    </div>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                      Customer is due a refund of {formatCurrency(paymentCalculation.refundDue)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">Payment Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.paymentType === 'refund' ? 'Refund Amount' : 'Payment Amount'}
                {(formData.autoFillFromPendingSales || paymentCalculation) && (
                  <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                    {paymentCalculation ? 'SMART-CALCULATED' : 'AUTO-CALCULATED'}
                  </span>
                )}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  disabled={formData.autoFillFromPendingSales || (paymentCalculation && formData.paymentType !== 'advance_payment')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-lg font-semibold ${
                    formData.autoFillFromPendingSales || paymentCalculation
                      ? `${formData.paymentType === 'refund' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'}`
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                  }`}
                  placeholder="0.00"
                  required
                />
              </div>
              {(formData.autoFillFromPendingSales || paymentCalculation) && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  {paymentCalculation ? 'Amount calculated with advance payment consideration' : 'Amount calculated from pending POS sales'}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Payment Method</h3>
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
                      ? `${method.bgColor} dark:bg-opacity-20 border-current shadow-md transform scale-105`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? method.color : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? method.color : 'text-gray-700 dark:text-gray-300'}`}>
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Received By</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.receivedBy}
                  onChange={(e) => handleChange('receivedBy', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  placeholder="Staff member name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Notes
                {formData.autoFillFromPendingSales && (
                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">AUTO-GENERATED</span>
                )}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  disabled={formData.autoFillFromPendingSales}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm resize-none ${
                    formData.autoFillFromPendingSales 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                  }`}
                  rows={3}
                  placeholder="Additional payment notes..."
                />
              </div>
              {formData.autoFillFromPendingSales && (
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Notes auto-generated from pending sales
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formData.paymentType === 'refund' 
              ? 'Refund will be processed and require admin approval'
              : 'Payment will be marked as pending and require admin approval'
            }
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
              className={`px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                formData.paymentType === 'refund'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              {formData.paymentType === 'refund' ? 'Process Refund' : 'Record Payment'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { DollarSign, User, Calendar, FileText, Calculator, ArrowLeftRight, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { formatCurrency, generateId } from '../../utils/helpers';

export function ServicePaymentForm({ isOpen, onClose, onSubmit, preSelectedTicket }) {
  const { customers, serviceTickets, sales, products, servicePayments } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTicketId: '',
    relatedSaleId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Admin',
    notes: '',
    paymentType: 'service_charge',
    externalParts: []
  });
  const [externalPartForm, setExternalPartForm] = useState({
    name: '',
    supplier: '',
    quantity: 1,
    unitPrice: 0,
    description: ''
  });
  const [showExternalParts, setShowExternalParts] = useState(false);
  const [paymentCalculation, setPaymentCalculation] = useState(null);

  // Set pre-selected ticket data when component opens
  useEffect(() => {
    if (preSelectedTicket && isOpen) {
      setFormData(prev => ({
        ...prev,
        customerId: preSelectedTicket.customerId,
        serviceTicketId: preSelectedTicket.id
      }));
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        customerId: '',
        serviceTicketId: '',
        relatedSaleId: '',
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Admin',
        notes: '',
        paymentType: 'service_charge',
        externalParts: []
      });
      setExternalPartForm({
        name: '',
        supplier: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
      });
      setShowExternalParts(false);
      setPaymentCalculation(null);
    }
  }, [preSelectedTicket, isOpen]);

  // Calculate smart payment when ticket or payment type changes
  useEffect(() => {
    if (formData.serviceTicketId && (formData.paymentType === 'service_charge' || formData.paymentType === 'final_payment')) {
      calculateSmartPayment();
    } else {
      setPaymentCalculation(null);
    }
  }, [formData.serviceTicketId, formData.paymentType]);

  const calculateSmartPayment = () => {
    const ticket = serviceTickets.find(t => t.id === formData.serviceTicketId);
    if (!ticket) return;

    // Get all approved advance payments for this ticket
    const advancePayments = servicePayments.filter(p => 
      p.serviceTicketId === ticket.id && 
      p.paymentType === 'advance_payment' && 
      p.status === 'approved'
    );

    const totalAdvance = advancePayments.reduce((sum, p) => sum + p.amount, 0);
    const totalServiceCost = (ticket.serviceCharge || 0) + (ticket.diagnosticFee || 0) + (ticket.partsCost || 0);
    const remainingBalance = totalServiceCost - totalAdvance;

    let calculation = {
      totalServiceCost,
      totalAdvance,
      remainingBalance,
      advanceApplied: 0,
      finalAmount: 0,
      refundDue: 0,
      breakdown: []
    };

    calculation.breakdown.push({
      label: 'Total Service Cost',
      amount: totalServiceCost,
      type: 'cost'
    });

    if (totalAdvance > 0) {
      calculation.breakdown.push({
        label: 'Total Advance Paid',
        amount: totalAdvance,
        type: 'credit'
      });
    }

    if (remainingBalance > 0) {
      // Customer needs to pay more
      calculation.finalAmount = remainingBalance;
      calculation.advanceApplied = totalAdvance;
      calculation.description = `Customer has paid ${formatCurrency(totalAdvance)} in advance. Remaining balance: ${formatCurrency(remainingBalance)}`;
      
      calculation.breakdown.push({
        label: 'Advance Applied (Reduced from balance)',
        amount: -totalAdvance,
        type: 'credit'
      });
      
      calculation.breakdown.push({
        label: 'Amount Due',
        amount: remainingBalance,
        type: 'total'
      });
      
      setFormData(prev => ({ ...prev, amount: remainingBalance }));
    } else if (remainingBalance < 0) {
      // Customer overpaid, needs refund
      calculation.refundDue = Math.abs(remainingBalance);
      calculation.advanceApplied = totalServiceCost;
      calculation.finalAmount = 0;
      calculation.description = `Customer overpaid by ${formatCurrency(Math.abs(remainingBalance))}. Refund required.`;
      
      calculation.breakdown.push({
        label: 'Service Cost Covered by Advance',
        amount: -totalServiceCost,
        type: 'credit'
      });
      
      calculation.breakdown.push({
        label: 'Refund Due',
        amount: Math.abs(remainingBalance),
        type: 'refund'
      });
      
      setFormData(prev => ({ ...prev, amount: 0 }));
    } else {
      // Exact payment
      calculation.advanceApplied = totalAdvance;
      calculation.finalAmount = 0;
      calculation.description = `Service cost exactly covered by advance payment of ${formatCurrency(totalAdvance)}`;
      
      calculation.breakdown.push({
        label: 'Fully Covered by Advance',
        amount: -totalAdvance,
        type: 'credit'
      });
      
      calculation.breakdown.push({
        label: 'Amount Due',
        amount: 0,
        type: 'total'
      });
      
      setFormData(prev => ({ ...prev, amount: 0 }));
    }

    setPaymentCalculation(calculation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const receiptNumber = `SP-${generateId()}`;
    
    // Get pending sales to complete for parts payment
    let pendingSalesToComplete = [];
    if (formData.paymentType === 'parts_payment' && formData.relatedSaleId) {
      const relatedSale = sales.find(s => s.id === formData.relatedSaleId);
      if (relatedSale && relatedSale.status === 'pending') {
        pendingSalesToComplete = [formData.relatedSaleId];
      }
    }
    
    const paymentData = {
      ...formData,
      receiptNumber,
      paymentDate: new Date(formData.paymentDate),
      amount: parseFloat(formData.amount),
      status: 'pending',
      createdAt: new Date(),
      pendingSalesToComplete,
      paymentCalculation: paymentCalculation
    };

    // Add external parts if any
    if (formData.externalParts.length > 0) {
      paymentData.externalParts = formData.externalParts;
    }
    
    onSubmit(paymentData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'customerId') {
      setFormData(prev => ({ ...prev, serviceTicketId: '', relatedSaleId: '' }));
    }
    
    if (field === 'serviceTicketId') {
      setFormData(prev => ({ ...prev, relatedSaleId: '' }));
    }
  };

  const handleExternalPartChange = (field, value) => {
    setExternalPartForm(prev => ({ ...prev, [field]: value }));
  };

  const addExternalPart = () => {
    if (externalPartForm.name && externalPartForm.quantity > 0 && externalPartForm.unitPrice > 0) {
      const newPart = {
        ...externalPartForm,
        id: generateId(),
        total: externalPartForm.quantity * externalPartForm.unitPrice
      };
      
      setFormData(prev => ({
        ...prev,
        externalParts: [...prev.externalParts, newPart]
      }));
      
      setExternalPartForm({
        name: '',
        supplier: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
      });
    }
  };

  const removeExternalPart = (partId) => {
    setFormData(prev => ({
      ...prev,
      externalParts: prev.externalParts.filter(part => part.id !== partId)
    }));
  };

  const customerTickets = serviceTickets.filter(t => 
    t.customerId === formData.customerId && 
    !['cancelled'].includes(t.status)
  );

  const customerSales = sales.filter(s => 
    s.customerId === formData.customerId && 
    (s.status === 'completed' || s.status === 'pending')
  );

  const getSaleDescription = (sale) => {
    const itemCount = sale.items.length;
    const statusText = sale.status === 'pending' ? ' [PENDING]' : '';
    return `Sale #${sale.id.slice(-6)} - ${itemCount} item(s) ($${sale.total.toFixed(2)})${statusText}`;
  };

  const getTicketCostSummary = (ticketId) => {
    const ticket = serviceTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    
    const totalCost = (ticket.serviceCharge || 0) + (ticket.diagnosticFee || 0) + (ticket.partsCost || 0);
    return {
      serviceCharge: ticket.serviceCharge || 0,
      diagnosticFee: ticket.diagnosticFee || 0,
      partsCost: ticket.partsCost || 0,
      totalCost
    };
  };

  const ticketCosts = formData.serviceTicketId ? getTicketCostSummary(formData.serviceTicketId) : null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Record Service Payment</span>
        </div>
      }
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Service Selection */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer & Service Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              value={formData.customerId}
              onChange={(e) => handleChange('customerId', e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </Select>
            
            <Select
              label="Service Ticket"
              value={formData.serviceTicketId}
              onChange={(e) => handleChange('serviceTicketId', e.target.value)}
              required
              disabled={!formData.customerId}
            >
              <option value="">Select Service Ticket</option>
              {customerTickets.map(ticket => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.ticketNumber} - {ticket.deviceBrand} {ticket.deviceModel}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Service Cost Summary */}
        {ticketCosts && (
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Service Cost Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Service Charge:</span>
                <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">{formatCurrency(ticketCosts.serviceCharge)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Diagnostic Fee:</span>
                <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">{formatCurrency(ticketCosts.diagnosticFee)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Parts Cost:</span>
                <span className="ml-2 font-medium text-purple-600 dark:text-purple-400">{formatCurrency(ticketCosts.partsCost)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
                <span className="ml-2 font-bold text-green-600 dark:text-green-400">{formatCurrency(ticketCosts.totalCost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Smart Payment Calculation Display */}
        {paymentCalculation && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-200">Smart Payment Calculation</h3>
            </div>
            
            <p className="text-cyan-800 dark:text-cyan-200 mb-4">{paymentCalculation.description}</p>
            
            <div className="bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4">
              <div className="space-y-3">
                {paymentCalculation.breakdown.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 ${
                    item.type === 'total' || item.type === 'refund' ? 'border-t border-gray-200 dark:border-gray-600 pt-3 font-bold' : ''
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
              
              {paymentCalculation.refundDue > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ArrowLeftRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                      Refund Required: {formatCurrency(paymentCalculation.refundDue)}
                    </p>
                  </div>
                  <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                    Customer has overpaid and should receive a refund
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-medium text-green-900 dark:text-green-200 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Payment Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payment Type"
              value={formData.paymentType}
              onChange={(e) => handleChange('paymentType', e.target.value)}
            >
              <option value="service_charge">Service Charge</option>
              <option value="advance_payment">Advance Payment</option>
              <option value="parts_payment">Parts Payment</option>
              <option value="diagnostic_fee">Diagnostic Fee</option>
              <option value="final_payment">Final Payment</option>
              <option value="refund">Refund</option>
            </Select>
            
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              disabled={paymentCalculation && (formData.paymentType === 'service_charge' || formData.paymentType === 'final_payment')}
            />
            
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
              <option value="check">Check</option>
            </Select>
            
            <Input
              label="Payment Date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Related Sale (for parts payment) */}
        {formData.paymentType === 'parts_payment' && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 dark:text-purple-200 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Parts Payment Options
            </h3>
            
            {customerSales.length > 0 && (
              <div className="mb-4">
                <Select
                  label="Related POS Sale (Optional)"
                  value={formData.relatedSaleId}
                  onChange={(e) => handleChange('relatedSaleId', e.target.value)}
                >
                  <option value="">Select related sale</option>
                  {customerSales.map(sale => (
                    <option key={sale.id} value={sale.id}>
                      {getSaleDescription(sale)}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700 dark:text-purple-300">External Parts (not from POS)</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowExternalParts(!showExternalParts)}
              >
                {showExternalParts ? 'Hide' : 'Add'} External Parts
              </Button>
            </div>
            
            {showExternalParts && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add External Part</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Part Name"
                    value={externalPartForm.name}
                    onChange={(e) => handleExternalPartChange('name', e.target.value)}
                    placeholder="e.g., RAM Module"
                  />
                  <Input
                    label="Supplier"
                    value={externalPartForm.supplier}
                    onChange={(e) => handleExternalPartChange('supplier', e.target.value)}
                    placeholder="e.g., External Vendor"
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={externalPartForm.quantity}
                    onChange={(e) => handleExternalPartChange('quantity', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    value={externalPartForm.unitPrice}
                    onChange={(e) => handleExternalPartChange('unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={externalPartForm.description}
                    onChange={(e) => handleExternalPartChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Part description or notes"
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {formatCurrency(externalPartForm.quantity * externalPartForm.unitPrice)}
                  </span>
                  <Button type="button" size="sm" onClick={addExternalPart}>
                    Add Part
                  </Button>
                </div>
              </div>
            )}
            
            {/* External Parts List */}
            {formData.externalParts.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">External Parts Added</h4>
                <div className="space-y-2">
                  {formData.externalParts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{part.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {part.quantity} × {formatCurrency(part.unitPrice)} = {formatCurrency(part.total)}
                        </p>
                        {part.supplier && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">Supplier: {part.supplier}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        onClick={() => removeExternalPart(part.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right">
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    External Parts Total: {formatCurrency(formData.externalParts.reduce((sum, part) => sum + part.total, 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Additional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Received By"
              value={formData.receivedBy}
              onChange={(e) => handleChange('receivedBy', e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                rows={3}
                placeholder="Additional payment notes..."
              />
            </div>
          </div>
        </div>

        {/* Payment Type Information */}
        {formData.paymentType === 'advance_payment' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-medium text-emerald-900 dark:text-emerald-200">Advance Payment</h4>
            </div>
            <p className="text-emerald-800 dark:text-emerald-200 text-sm">
              This payment will be held as advance and applied when the service is completed.
            </p>
          </div>
        )}

        {formData.paymentType === 'refund' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowLeftRight className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-medium text-red-900 dark:text-red-200">Refund Payment</h4>
            </div>
            <p className="text-red-800 dark:text-red-200 text-sm">
              This will process a refund to the customer for overpayment.
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <DollarSign className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
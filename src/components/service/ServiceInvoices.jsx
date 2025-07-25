import { CheckCircle, DollarSign, Eye, FileText, Printer } from "lucide-react";
import React from "react";
import { useInventory } from "../../contexts/InventoryContext";
import { useTheme } from "../../contexts/ThemeContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Modal } from "../common/Modal";
import { SearchInput } from "../common/SearchInput";
import { Select } from "../common/Select";
import { StatusBadge } from "../common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../common/Table";

export function ServiceInvoices() {
  const {
    serviceInvoices,
    customers,
    serviceTickets,
    technicians,
    updateServiceTicket,
    generateServiceInvoice,
  } = useInventory();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showInvoiceView, setShowInvoiceView] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  // Filter invoices based on search and status
  const filteredInvoices = serviceInvoices.filter((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customerId);
    const ticket = serviceTickets.find((t) => t.id === invoice.serviceTicketId);

    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket?.ticketNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  const getTicketNumber = (serviceTicketId) => {
    const ticket = serviceTickets.find((t) => t.id === serviceTicketId);
    return ticket ? ticket.ticketNumber : "Unknown Ticket";
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceView(true);
  };

  const handlePrintInvoice = (invoice) => {
    const customer = customers.find((c) => c.id === invoice.customerId);
    const ticket = serviceTickets.find((t) => t.id === invoice.serviceTicketId);
    const technician = ticket
      ? technicians.find((t) => t.id === ticket.assignedTechnician)
      : null;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Invoice - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #ea580c; margin-bottom: 5px; }
            .company-tagline { color: #6b7280; font-size: 14px; }
            .invoice-title { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
            .invoice-number { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; color: #374151; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .detail-section h3 { color: #1f2937; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-label { font-weight: 600; color: #4b5563; }
            .detail-value { color: #1f2937; }
            .service-details { margin: 30px 0; }
            .service-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .amount-section { background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; text-align: center; margin: 30px 0; }
            .amount-label { font-size: 18px; color: #4b5563; margin-bottom: 10px; }
            .amount-value { font-size: 32px; font-weight: bold; color: #059669; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
            .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 40px; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 2px solid #374151; margin-top: 50px; padding-top: 10px; font-weight: 600; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Hi Tech Computer</div>
            <div class="company-tagline">Professional Computer Service & Repair</div>
            <div style="margin-top: 10px; color: #6b7280; font-size: 14px;">
              📍 123 Tech Street, Silicon Valley | 📞 +1-555-0123 | ✉️ service@hitechcomputer.com
            </div>
          </div>
          
          <div class="invoice-title">SERVICE INVOICE</div>
          
          <div class="invoice-number">
            Invoice No: ${invoice.invoiceNumber}
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>Customer Information</h3>
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${customer?.name || "N/A"}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${customer?.email || "N/A"}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customer?.phone || "N/A"}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>Service Information</h3>
              <div class="detail-item">
                <span class="detail-label">Ticket:</span>
                <span class="detail-value">${
                  ticket?.ticketNumber || "N/A"
                }</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Device:</span>
                <span class="detail-value">${ticket?.deviceBrand || ""} ${
      ticket?.deviceModel || ""
    }</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Technician:</span>
                <span class="detail-value">${technician?.name || "N/A"}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(
                  invoice.createdAt
                )}</span>
              </div>
            </div>
          </div>
          
          <div class="service-details">
            <h3>Service Details</h3>
            <div class="service-box">
              <strong>Issue Description:</strong><br>
              ${ticket?.issueDescription || "N/A"}
            </div>
            ${
              ticket?.technicianNotes
                ? `
              <div class="service-box">
                <strong>Technician Notes:</strong><br>
                ${ticket.technicianNotes}
              </div>
            `
                : ""
            }
          </div>
          
          <div class="detail-section">
            <h3>Cost Breakdown</h3>
            <div class="detail-item">
              <span class="detail-label">Labor Cost:</span>
              <span class="detail-value">${formatCurrency(
                invoice.laborCost
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Parts Cost:</span>
              <span class="detail-value">${formatCurrency(
                invoice.partsCost
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Subtotal:</span>
              <span class="detail-value">${formatCurrency(
                invoice.subtotal
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tax:</span>
              <span class="detail-value">${formatCurrency(invoice.tax)}</span>
            </div>
          </div>
          
          <div class="amount-section">
            <div class="amount-label">Total Amount</div>
            <div class="amount-value">${formatCurrency(invoice.total)}</div>
          </div>
          
          <div class="footer">
            <div style="margin-bottom: 20px;">
              <strong>Payment Terms:</strong> Payment is due within 30 days of invoice date.
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">Customer Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line">Authorized Signature</div>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">
                Thank you for choosing Hi Tech Computer!
              </div>
              <div style="color: #6b7280; font-size: 12px;">
                For support, contact us at service@hitechcomputer.com or +1-555-0123
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Calculate statistics
  const totalInvoices = filteredInvoices.length;
  const totalRevenue = filteredInvoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );
  const paidInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "paid"
  ).length;
  const pendingInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "draft" || invoice.status === "sent"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Service Invoices
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track service billing and payments
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Invoices
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                {totalInvoices}
              </p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <FileText className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="bg-green-200 dark:bg-green-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Paid Invoices
              </p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-200">
                {paidInvoices}
              </p>
            </div>
            <div className="bg-emerald-200 dark:bg-emerald-800/50 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Pending
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-200">
                {pendingInvoices}
              </p>
            </div>
            <div className="bg-orange-200 dark:bg-orange-800/50 p-3 rounded-full">
              <FileText className="w-8 h-8 text-orange-700 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Found {filteredInvoices.length} invoice
          {filteredInvoices.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No invoices found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Service invoices will appear here when tickets are completed"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service Ticket</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Parts Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getCustomerName(invoice.customerId)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Customer
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTicketNumber(invoice.serviceTicketId)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Service Ticket
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <DollarSign size={14} className="mr-1" />
                      <span className="font-medium">
                        {formatCurrency(invoice.laborCost)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-purple-600 dark:text-purple-400">
                      <DollarSign size={14} className="mr-1" />
                      <span className="font-medium">
                        {formatCurrency(invoice.partsCost)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <DollarSign size={14} className="mr-1" />
                      <span className="font-bold text-lg">
                        {formatCurrency(invoice.total)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(invoice.dueDate)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Due date
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                        title="Print Invoice"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Invoice View Modal */}
      {selectedInvoice && (
        <ServiceInvoiceView
          isOpen={showInvoiceView}
          onClose={() => {
            setShowInvoiceView(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          onPrint={() => handlePrintInvoice(selectedInvoice)}
        />
      )}
    </div>
  );
}

// Service Invoice View Component
function ServiceInvoiceView({ isOpen, onClose, invoice, onPrint }) {
  const { customers, serviceTickets, technicians } = useInventory();
  const { isDark } = useTheme();

  if (!invoice) return null;

  const customer = customers.find((c) => c.id === invoice.customerId);
  const ticket = serviceTickets.find((t) => t.id === invoice.serviceTicketId);
  const technician = ticket
    ? technicians.find((t) => t.id === ticket.assignedTechnician)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Service Invoice Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {invoice.invoiceNumber}
              </h2>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Created: {formatDate(invoice.createdAt)}</p>
              <p>Due: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <StatusBadge status={invoice.status} className="mb-2" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(invoice.total)}
            </p>
          </div>
        </div>

        {/* Customer and Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {customer?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {customer?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {customer?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Service Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium">Ticket:</span>{" "}
                {ticket?.ticketNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Device:</span>{" "}
                {ticket?.deviceBrand} {ticket?.deviceModel}
              </p>
              <p>
                <span className="font-medium">Technician:</span>{" "}
                {technician?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        {ticket && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Service Details
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">Issue:</span>{" "}
              {ticket.issueDescription}
            </p>
            {ticket.technicianNotes && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Notes:</span>{" "}
                {ticket.technicianNotes}
              </p>
            )}
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Cost Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Labor Cost:</span>
              <span>{formatCurrency(invoice.laborCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Parts Cost:</span>
              <span>{formatCurrency(invoice.partsCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Tax:</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

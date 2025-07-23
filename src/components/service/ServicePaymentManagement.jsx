import { CheckCircle, DollarSign, Edit2, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useInventory } from "../../contexts/InventoryContext";
import { useTheme } from "../../contexts/ThemeContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
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
import { ServicePaymentApproval } from "./ServicePaymentApproval";
import { ServicePaymentEditForm } from "./ServicePaymentEditForm";
import { ServicePaymentForm } from "./ServicePaymentForm";
import { ServicePaymentView } from "./ServicePaymentView";

export function ServicePaymentManagement() {
  const {
    servicePayments,
    addServicePayment,
    updateServicePayment,
    deleteServicePayment,
    customers,
    serviceTickets,
    sales,
    products,
  } = useInventory();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [approvalAction, setApprovalAction] = useState("");

  const isAdmin = currentUser?.role === "admin";

  const handleAddPayment = (paymentData) => {
    addServicePayment(paymentData);
    setShowPaymentForm(false);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentView(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setShowEditForm(true);
  };

  const handleUpdatePayment = (paymentData) => {
    updateServicePayment(selectedPayment.id, paymentData);
    setShowEditForm(false);
    setSelectedPayment(null);
  };

  const handleDeletePayment = (paymentId) => {
    if (
      window.confirm("Are you sure you want to delete this payment record?")
    ) {
      deleteServicePayment(paymentId);
    }
  };

  const handleApprovePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction("approve");
    setShowApprovalModal(true);
  };

  const handleDeclinePayment = (payment) => {
    setSelectedPayment(payment);
    setApprovalAction("decline");
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = (paymentId, message) => {
    const updateData = {
      status: approvalAction === "approve" ? "approved" : "declined",
      adminMessage: message,
      approvedBy: currentUser?.name,
      approvedAt: new Date(),
    };

    updateServicePayment(paymentId, updateData);
    setShowApprovalModal(false);
    setSelectedPayment(null);
    setApprovalAction("");
  };

  const getPaymentDetails = (payment) => {
    const customer = customers.find((c) => c.id === payment.customerId);
    const ticket = serviceTickets.find((t) => t.id === payment.serviceTicketId);
    const relatedSale = payment.relatedSaleId
      ? sales.find((s) => s.id === payment.relatedSaleId)
      : null;

    return { customer, ticket, relatedSale };
  };

  const filteredPayments = servicePayments.filter((payment) => {
    const { customer, ticket, relatedSale } = getPaymentDetails(payment);

    const matchesSearch =
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (relatedSale &&
        relatedSale.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const approvedPayments = filteredPayments.filter(
    (p) => p.status === "approved"
  ).length;
  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Service Payment Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage service payments and approvals
            </p>
          </div>
          <Button
            onClick={() => setShowPaymentForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <DollarSign size={20} className="mr-2" />
            Record Payment
          </Button>
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </Select>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Payments
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                {totalPayments}
              </p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800/50 p-3 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                {formatCurrency(totalAmount)}
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
                Approved
              </p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-200">
                {approvedPayments}
              </p>
            </div>
            <div className="bg-emerald-200 dark:bg-emerald-800/50 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">
                {pendingPayments}
              </p>
            </div>
            <div className="bg-yellow-200 dark:bg-yellow-800/50 p-3 rounded-full">
              <XCircle className="w-8 h-8 text-yellow-700 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Found {filteredPayments.length} payment
          {filteredPayments.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Service payments will appear here when customers make payments"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service Ticket</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const { customer, ticket, relatedSale } =
                  getPaymentDetails(payment);

                return (
                  <TableRow
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.receiptNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {customer?.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {ticket?.ticketNumber || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {ticket?.deviceBrand} {ticket?.deviceModel}
                          {relatedSale && (
                            <span className="ml-2 text-purple-600 dark:text-purple-400">
                              • Sale #{relatedSale.id.slice(-6)}
                            </span>
                          )}
                          {payment.paymentType === "advance_payment" &&
                            payment.status === "approved" && (
                              <span className="ml-2 text-blue-600 dark:text-blue-400">
                                • ADVANCE
                              </span>
                            )}
                          {payment.paymentType === "refund" && (
                            <span className="ml-2 text-red-600 dark:text-red-400">
                              • REFUND
                            </span>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            payment.paymentType === "advance_payment"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                              : payment.paymentType === "refund"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              : payment.paymentType === "parts_payment"
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {payment.paymentType.replace("_", " ")}
                        </span>
                        {payment.paymentType === "parts_payment" &&
                          relatedSale && (
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                              Linked to POS sale
                            </p>
                          )}
                        {payment.paymentCalculation && (
                          <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                            Smart calculated
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center ${
                          payment.paymentType === "refund"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        <DollarSign size={14} className="mr-1" />
                        <span className="font-medium">
                          {payment.paymentType === "refund" ? "-" : ""}
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      {payment.paymentType === "advance_payment" &&
                        payment.status === "approved" && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Applied to service
                          </p>
                        )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
                        {payment.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.paymentDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Payment"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              title="Edit Payment"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                              title="Delete Payment"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                        {isAdmin && payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprovePayment(payment)}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                              title="Approve Payment"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleDeclinePayment(payment)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                              title="Decline Payment"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <ServicePaymentForm
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handleAddPayment}
      />

      {selectedPayment && (
        <ServicePaymentView
          isOpen={showPaymentView}
          onClose={() => {
            setShowPaymentView(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}

      {isAdmin && selectedPayment && (
        <ServicePaymentEditForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onSubmit={handleUpdatePayment}
        />
      )}

      {isAdmin && selectedPayment && (
        <ServicePaymentApproval
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedPayment(null);
            setApprovalAction("");
          }}
          payment={selectedPayment}
          action={approvalAction}
          onSubmit={handleApprovalSubmit}
        />
      )}
    </div>
  );
}

import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  generateId, 
  generateInvoiceNumber, 
  generateTicketNumber, 
  generateServiceInvoiceNumber 
} from '../utils/helpers';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useLocalStorage('products', []);
  const [customers, setCustomers] = useLocalStorage('customers', []);
  const [suppliers, setSuppliers] = useLocalStorage('suppliers', []);
  const [sales, setSales] = useLocalStorage('sales', []);
  const [purchases, setPurchases] = useLocalStorage('purchases', []);
  const [courses, setCourses] = useLocalStorage('courses', []);
  const [invoices, setInvoices] = useLocalStorage('invoices', []);
  const [serviceTickets, setServiceTickets] = useLocalStorage('serviceTickets', []);
  const [technicians, setTechnicians] = useLocalStorage('technicians', []);
  const [serviceInvoices, setServiceInvoices] = useLocalStorage('serviceInvoices', []);
  const [courseBatches, setCourseBatches] = useLocalStorage('courseBatches', []);
  const [students, setStudents] = useLocalStorage('students', []);
  const [admissions, setAdmissions] = useLocalStorage('admissions', []);
  const [enrollments, setEnrollments] = useLocalStorage('enrollments', []);
  const [coursePayments, setCoursePayments] = useLocalStorage('coursePayments', []);
  const [paymentVouchers, setPaymentVouchers] = useLocalStorage('paymentVouchers', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage('attendanceRecords', []);
  const [attendanceSessions, setAttendanceSessions] = useLocalStorage('attendanceSessions', []);
  const [servicePayments, setServicePayments] = useLocalStorage('servicePayments', []);

  // Initialize with sample data if empty
  useEffect(() => {
    if (products.length === 0) {
      const sampleProducts = [
        {
          id: '1',
          name: 'Dell Laptop XPS 13',
          category: 'laptop',
          sku: 'DL-XPS13-001',
          description: 'High-performance laptop for professionals',
          buyingPrice: 800,
          sellingPrice: 1200,
          stock: 5,
          minStock: 2,
          supplierId: '1',
          warrantyPeriod: 12,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Corsair Vengeance LPX 16GB RAM',
          category: 'component',
          sku: 'CR-RAM16-001',
          description: 'DDR4 3200MHz RAM module',
          buyingPrice: 60,
          sellingPrice: 85,
          stock: 20,
          minStock: 5,
          supplierId: '2',
          warrantyPeriod: 24,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setProducts(sampleProducts);
    }

    if (suppliers.length === 0) {
      const sampleSuppliers = [
        {
          id: '1',
          name: 'Tech Distributors Ltd',
          email: 'sales@techdist.com',
          phone: '+1-555-0123',
          address: '123 Tech Street, Silicon Valley',
          products: ['1'],
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Component World',
          email: 'orders@compworld.com',
          phone: '+1-555-0456',
          address: '456 Component Ave, Tech City',
          products: ['2'],
          createdAt: new Date()
        }
      ];
      setSuppliers(sampleSuppliers);
    }

    if (courses.length === 0) {
      const sampleCourses = [
        {
          id: '1',
          name: 'Computer Hardware Fundamentals',
          duration: 40,
          price: 299,
          admissionFee: 50,
          registrationFee: 25,
          examFee: 30,
          description: 'Learn the basics of computer hardware components and assembly',
          materials: ['Workbooks', 'Practice Hardware', 'Online Resources'],
          instructor: 'John Smith',
          maxStudents: 15,
          status: 'active',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Advanced Laptop Repair',
          duration: 60,
          price: 499,
          admissionFee: 75,
          registrationFee: 35,
          examFee: 50,
          description: 'Advanced techniques for laptop troubleshooting and repair',
          materials: ['Repair Tools', 'Test Equipment', 'Schematics'],
          instructor: 'Sarah Johnson',
          maxStudents: 10,
          status: 'active',
          createdAt: new Date()
        }
      ];
      setCourses(sampleCourses);
    }

    if (technicians.length === 0) {
      const sampleTechnicians = [
        {
          id: '1',
          name: 'Mike Johnson',
          email: 'mike@techflow.com',
          phone: '+1-555-0789',
          specializations: ['Laptop Repair', 'Hardware Diagnostics', 'Data Recovery'],
          hourlyRate: 45,
          status: 'active',
          totalTicketsCompleted: 0,
          averageRating: 0,
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Sarah Davis',
          email: 'sarah@techflow.com',
          phone: '+1-555-0890',
          specializations: ['Software Issues', 'Virus Removal', 'System Optimization'],
          hourlyRate: 40,
          status: 'active',
          totalTicketsCompleted: 0,
          averageRating: 0,
          createdAt: new Date()
        }
      ];
      setTechnicians(sampleTechnicians);
    }

    if (courseBatches.length === 0) {
      const sampleBatches = [
        {
          id: '1',
          courseId: '1',
          batchName: 'HW-2024-01',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-28'),
          schedule: 'Mon, Wed, Fri 10:00 AM - 12:00 PM',
          maxStudents: 15,
          currentStudents: 8,
          status: 'ongoing',
          createdAt: new Date()
        },
        {
          id: '2',
          courseId: '2',
          batchName: 'LR-2024-01',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-04-15'),
          schedule: 'Tue, Thu 2:00 PM - 5:00 PM',
          maxStudents: 10,
          currentStudents: 5,
          status: 'upcoming',
          createdAt: new Date()
        }
      ];
      setCourseBatches(sampleBatches);
    }
  }, []);

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, productData) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: generateId(),
      createdAt: new Date(),
      totalPurchases: 0
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const addSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: generateId(),
      createdAt: new Date()
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const addSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: generateId(),
      createdAt: new Date()
    };
    setSales([...sales, newSale]);

    // Update product stock
    saleData.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });

    // Update customer total purchases
    const customer = customers.find(c => c.id === saleData.customerId);
    if (customer) {
      setCustomers(customers.map(c => 
        c.id === saleData.customerId
          ? { ...c, totalPurchases: c.totalPurchases + saleData.total }
          : c
      ));
    }
  };

  const addPurchase = (purchaseData) => {
    const newPurchase = {
      ...purchaseData,
      id: generateId(),
      createdAt: new Date()
    };
    setPurchases([...purchases, newPurchase]);

    // Update product stock if purchase is received
    if (purchaseData.status === 'received') {
      purchaseData.items.forEach(item => {
        updateStock(item.productId, item.quantity);
      });
    }
  };

  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: generateId(),
      createdAt: new Date()
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id, courseData) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...courseData } : course
    ));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const generateInvoice = (saleId) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    const invoiceNumber = generateInvoiceNumber();
    const newInvoice = {
      id: generateId(),
      invoiceNumber,
      saleId: sale.id,
      customerId: sale.customerId,
      items: sale.items,
      subtotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount,
      total: sale.total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft',
      createdAt: new Date()
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id, invoiceData) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, ...invoiceData, updatedAt: new Date() }
        : invoice
    ));
  };
  const updateStock = (productId, quantity) => {
    setProducts(products.map(product => 
      product.id === productId
        ? { ...product, stock: Math.max(0, product.stock + quantity), updatedAt: new Date() }
        : product
    ));
  };

  const addServiceTicket = (ticketData) => {
    const ticketNumber = generateTicketNumber();
    const newTicket = {
      ...ticketData,
      id: generateId(),
      ticketNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setServiceTickets([...serviceTickets, newTicket]);
    return newTicket; // Return the new ticket
  };

  const updateServiceTicket = (id, ticketData) => {
    setServiceTickets(serviceTickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...ticketData, updatedAt: new Date() }
        : ticket
    ));

    // Update parts stock when ticket is completed
    if (ticketData.status === 'completed') {
      const ticket = serviceTickets.find(t => t.id === id);
      if (ticket) {
        ticket.partsUsed.forEach(part => {
          updateStock(part.productId, -part.quantity);
        });
      }
    }
  };

  const addTechnician = (technicianData) => {
    const newTechnician = {
      ...technicianData,
      id: generateId(),
      totalTicketsCompleted: 0,
      averageRating: 0,
      createdAt: new Date()
    };
    setTechnicians([...technicians, newTechnician]);
  };

  const generateServiceInvoice = (serviceTicketId) => {
    const ticket = serviceTickets.find(t => t.id === serviceTicketId);
    if (!ticket) return;

    // Check if invoice already exists
    const existingInvoice = serviceInvoices.find(inv => inv.serviceTicketId === serviceTicketId);
    if (existingInvoice) {
      console.log('Invoice already exists for this ticket');
      return;
    }
    const invoiceNumber = generateServiceInvoiceNumber();
    const subtotal = (ticket.serviceCharge || 0) + (ticket.diagnosticFee || 0) + ticket.partsCost;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const newServiceInvoice = {
      id: generateId(),
      invoiceNumber,
      serviceTicketId: ticket.id,
      customerId: ticket.customerId,
      serviceCharge: ticket.serviceCharge || 0,
      diagnosticFee: ticket.diagnosticFee || 0,
      partsCost: ticket.partsCost,
      subtotal,
      tax,
      discount: 0,
      total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft',
      createdAt: new Date()
    };
    setServiceInvoices([...serviceInvoices, newServiceInvoice]);
    
    return newServiceInvoice;
  };

  const addCourseBatch = (batchData) => {
    const newBatch = {
      ...batchData,
      id: generateId(),
      createdAt: new Date()
    };
    setCourseBatches([...courseBatches, newBatch]);
  };

  const updateCourseBatch = (id, batchData) => {
    setCourseBatches(courseBatches.map(batch => 
      batch.id === id ? { ...batch, ...batchData } : batch
    ));
  };

  const deleteCourseBatch = (id) => {
    setCourseBatches(courseBatches.filter(batch => batch.id !== id));
  };

  const deleteServiceTicket = (id) => {
    setServiceTickets(serviceTickets.filter(ticket => ticket.id !== id));
  };

  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: generateId(),
      createdAt: new Date()
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id, studentData) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const addAdmission = (admissionData) => {
    const newAdmission = {
      ...admissionData,
      id: generateId(),
      admissionDate: new Date(),
      createdAt: new Date()
    };
    setAdmissions([...admissions, newAdmission]);
  };

  const updateAdmission = (id, admissionData) => {
    setAdmissions(admissions.map(admission => 
      admission.id === id ? { ...admission, ...admissionData } : admission
    ));
  };

  const addEnrollment = (enrollmentData) => {
    const newEnrollment = {
      ...enrollmentData,
      id: generateId(),
      enrollmentDate: new Date(),
      createdAt: new Date()
    };
    setEnrollments([...enrollments, newEnrollment]);

    // Update batch current students count
    setCourseBatches(courseBatches.map(batch =>
      batch.id === enrollmentData.batchId
        ? { ...batch, currentStudents: batch.currentStudents + 1 }
        : batch
    ));
  };

  const updateEnrollment = (id, enrollmentData) => {
    setEnrollments(enrollments.map(enrollment => 
      enrollment.id === id ? { ...enrollment, ...enrollmentData } : enrollment
    ));
  };

  const deleteEnrollment = (id) => {
    const enrollment = enrollments.find(e => e.id === id);
    if (enrollment) {
      // Update batch current students count
      setCourseBatches(courseBatches.map(batch =>
        batch.id === enrollment.batchId
          ? { ...batch, currentStudents: Math.max(0, batch.currentStudents - 1) }
          : batch
      ));
    }
    setEnrollments(enrollments.filter(enrollment => enrollment.id !== id));
  };

  const addCoursePayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: generateId(),
      createdAt: new Date()
    };
    setCoursePayments([...coursePayments, newPayment]);

    // Update enrollment payment status only for approved payments
    if (paymentData.status === 'approved' && paymentData.paymentType === 'enrollment') {
      setEnrollments(enrollments.map(enrollment =>
        enrollment.id === paymentData.enrollmentId
          ? {
              ...enrollment,
              paidAmount: enrollment.paidAmount + paymentData.amount,
              remainingAmount: enrollment.remainingAmount - paymentData.amount
            }
          : enrollment
      ));
    } else if (paymentData.status === 'approved' && paymentData.paymentType === 'admission') {
      setEnrollments(enrollments.map(enrollment =>
        enrollment.id === paymentData.enrollmentId
          ? { 
              ...enrollment, 
              admissionFeePaid: true,
              admissionFeeAmount: (enrollment.admissionFeeAmount || 0) + paymentData.amount
            }
          : enrollment
      ));
    } else if (paymentData.status === 'approved' && paymentData.paymentType === 'registration') {
      setEnrollments(enrollments.map(enrollment =>
        enrollment.id === paymentData.enrollmentId
          ? { 
              ...enrollment, 
              registrationFeePaid: true,
              registrationFeeAmount: (enrollment.registrationFeeAmount || 0) + paymentData.amount
            }
          : enrollment
      ));
    } else if (paymentData.status === 'approved' && paymentData.paymentType === 'exam') {
      setEnrollments(enrollments.map(enrollment =>
        enrollment.id === paymentData.enrollmentId
          ? { 
              ...enrollment, 
              examFeePaid: true,
              examFeeAmount: (enrollment.examFeeAmount || 0) + paymentData.amount
            }
          : enrollment
      ));
    }
  };

  const updateCoursePayment = (id, paymentData) => {
    setCoursePayments(coursePayments.map(payment => 
      payment.id === id ? { ...payment, ...paymentData } : payment
    ));
    
    // Update enrollment data when payment is updated
    const payment = coursePayments.find(p => p.id === id);
    if (payment && payment.enrollmentId) {
      const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
      if (enrollment) {
        // Get the updated payment data
        const updatedPayment = { ...payment, ...paymentData };
        
        // Recalculate enrollment amounts based on all approved payments for this enrollment
        const enrollmentPayments = coursePayments.map(p => 
          p.id === id ? updatedPayment : p
        ).filter(p => p.enrollmentId === payment.enrollmentId && p.status === 'approved');
        
        let totalPaid = 0;
        let admissionFeeAmount = 0;
        let registrationFeeAmount = 0;
        let examFeeAmount = 0;
        
        enrollmentPayments.forEach(p => {
          switch (p.paymentType) {
            case 'enrollment':
              totalPaid += p.amount;
              break;
            case 'admission':
              admissionFeeAmount += p.amount;
              break;
            case 'registration':
              registrationFeeAmount += p.amount;
              break;
            case 'exam':
              examFeeAmount += p.amount;
              break;
          }
        });
        
        // Update enrollment with recalculated amounts
        setEnrollments(enrollments.map(e => 
          e.id === enrollment.id 
            ? {
                ...e,
                paidAmount: totalPaid,
                remainingAmount: e.totalAmount - totalPaid,
                admissionFeeAmount,
                registrationFeeAmount,
                examFeeAmount,
                admissionFeePaid: admissionFeeAmount > 0,
                registrationFeePaid: registrationFeeAmount > 0,
                examFeePaid: examFeeAmount > 0
              }
            : e
        ));
      }
    }
  };

  const deleteCoursePayment = (id) => {
    const payment = coursePayments.find(p => p.id === id);
    if (payment) {
      // Revert enrollment payment status based on payment type
      if (payment.paymentType === 'enrollment') {
        setEnrollments(enrollments.map(enrollment =>
          enrollment.id === payment.enrollmentId
            ? {
                ...enrollment,
                paidAmount: enrollment.paidAmount - payment.amount,
                remainingAmount: enrollment.remainingAmount + payment.amount
              }
            : enrollment
        ));
      } else if (payment.paymentType === 'admission') {
        setEnrollments(enrollments.map(enrollment =>
          enrollment.id === payment.enrollmentId
            ? { 
                ...enrollment, 
                admissionFeeAmount: Math.max(0, (enrollment.admissionFeeAmount || 0) - payment.amount)
              }
            : enrollment
        ));
      } else if (payment.paymentType === 'registration') {
        setEnrollments(enrollments.map(enrollment =>
          enrollment.id === payment.enrollmentId
            ? { 
                ...enrollment, 
                registrationFeeAmount: Math.max(0, (enrollment.registrationFeeAmount || 0) - payment.amount)
              }
            : enrollment
        ));
      } else if (payment.paymentType === 'exam') {
        setEnrollments(enrollments.map(enrollment =>
          enrollment.id === payment.enrollmentId
            ? { 
                ...enrollment, 
                examFeeAmount: Math.max(0, (enrollment.examFeeAmount || 0) - payment.amount)
              }
            : enrollment
        ));
      }
    }
    setCoursePayments(coursePayments.filter(payment => payment.id !== id));
  };

  const generatePaymentVoucher = (voucherNumber) => {
    const payment = coursePayments.find(p => p.voucherNumber === voucherNumber);
    if (!payment) return;

    const enrollment = payment.enrollmentId ? enrollments.find(e => e.id === payment.enrollmentId) : null;
    const student = students.find(s => s.id === payment.studentId);
    const course = enrollment ? courses.find(c => c.id === enrollment.courseId) : null;
    const batch = enrollment ? courseBatches.find(b => b.id === enrollment.batchId) : null;

    const newVoucher = {
      id: generateId(),
      voucherNumber: payment.voucherNumber,
      paymentId: payment.id,
      studentName: student?.name || 'Unknown',
      courseName: course?.name || 'Unknown',
      batchName: batch?.batchName || 'Unknown',
      paymentType: payment.paymentType,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      receivedBy: payment.receivedBy,
      installmentInfo: '',
      createdAt: new Date()
    };
    setPaymentVouchers([...paymentVouchers, newVoucher]);
  };

  const addAttendanceSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: generateId(),
      createdAt: new Date()
    };
    setAttendanceSessions([...attendanceSessions, newSession]);
  };

  const updateAttendanceRecord = (sessionId, studentId, status, notes) => {
    setAttendanceSessions(attendanceSessions.map(session => {
      if (session.id === sessionId) {
        const existingRecord = session.attendanceRecords.find(r => r.studentId === studentId);
        if (existingRecord) {
          // Update existing record
          return {
            ...session,
            attendanceRecords: session.attendanceRecords.map(record =>
              record.studentId === studentId
                ? { ...record, status, notes, createdAt: new Date() }
                : record
            )
          };
        } else {
          // Create new record
          const enrollment = enrollments.find(e => e.studentId === studentId && e.batchId === session.batchId);
          if (enrollment) {
            const newRecord = {
              id: generateId(),
              enrollmentId: enrollment.id,
              studentId,
              batchId: session.batchId,
              date: session.date,
              status,
              notes,
              markedBy: 'Admin', // You can make this dynamic
              createdAt: new Date()
            };
            return {
              ...session,
              attendanceRecords: [...session.attendanceRecords, newRecord]
            };
          }
        }
      }
      return session;
    }));
  };
  const addServicePayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: generateId(),
      createdAt: new Date()
    };
    setServicePayments([...servicePayments, newPayment]);
    
    // If payment is approved and has pending sales to complete, mark them as completed
    if (paymentData.status === 'approved' && paymentData.pendingSalesToComplete && paymentData.pendingSalesToComplete.length > 0) {
      setSales(sales.map(sale => 
        paymentData.pendingSalesToComplete.includes(sale.id)
          ? { ...sale, status: 'completed', completedAt: new Date() }
          : sale
      ));
      
      // Add parts cost to the service ticket
      if (paymentData.serviceTicketId && paymentData.paymentType === 'parts_payment') {
        const totalPartsCost = paymentData.pendingSalesToComplete.reduce((sum, saleId) => {
          const sale = sales.find(s => s.id === saleId);
          return sum + (sale ? sale.total : 0);
        }, 0);
        
        // Add external parts cost if any
        const externalPartsCost = paymentData.externalParts ? 
          paymentData.externalParts.reduce((sum, part) => sum + part.total, 0) : 0;
        
        setServiceTickets(serviceTickets.map(ticket => 
          ticket.id === paymentData.serviceTicketId
            ? { 
                ...ticket, 
                partsCost: (ticket.partsCost || 0) + totalPartsCost + externalPartsCost,
                externalParts: [...(ticket.externalParts || []), ...(paymentData.externalParts || [])],
                advancePayments: ticket.advancePayments || [],
                updatedAt: new Date()
              }
            : ticket
        ));
      }
    }
    
    // Handle advance payments - track them in the service ticket
    if (paymentData.paymentType === 'advance_payment' && paymentData.serviceTicketId) {
      setServiceTickets(serviceTickets.map(ticket => 
        ticket.id === paymentData.serviceTicketId
          ? { 
              ...ticket, 
              advancePayments: [...(ticket.advancePayments || []), newPayment.id],
              totalAdvancePaid: paymentData.amount,
              updatedAt: new Date()
            }
          : ticket
      ));
    }
    
    // Handle refund payments - update service ticket refund tracking
    if (paymentData.paymentType === 'refund' && paymentData.serviceTicketId) {
      setServiceTickets(serviceTickets.map(ticket => 
        ticket.id === paymentData.serviceTicketId
          ? { 
              ...ticket, 
              refundPayments: [...(ticket.refundPayments || []), newPayment.id],
              totalRefundGiven: (ticket.totalRefundGiven || 0) + paymentData.amount,
              updatedAt: new Date()
            }
          : ticket
      ));
    }
    
    return newPayment;
  };

  const updateServicePayment = (id, paymentData) => {
    setServicePayments(servicePayments.map(payment => 
      payment.id === id ? { ...payment, ...paymentData } : payment
    ));
    
    // If payment is being approved and has pending sales to complete
    const payment = servicePayments.find(p => p.id === id);
    if (payment && paymentData.status === 'approved' && payment.pendingSalesToComplete && payment.pendingSalesToComplete.length > 0) {
      setSales(sales.map(sale => 
        payment.pendingSalesToComplete.includes(sale.id)
          ? { ...sale, status: 'completed', completedAt: new Date() }
          : sale
      ));
      
      // Add parts cost to the service ticket when payment is approved
      if (payment.serviceTicketId && payment.paymentType === 'parts_payment') {
        const totalPartsCost = payment.pendingSalesToComplete.reduce((sum, saleId) => {
          const sale = sales.find(s => s.id === saleId);
          return sum + (sale ? sale.total : 0);
        }, 0);
        
        setServiceTickets(serviceTickets.map(ticket => 
          ticket.id === payment.serviceTicketId
            ? { 
                ...ticket, 
                partsCost: (ticket.partsCost || 0) + totalPartsCost,
                updatedAt: new Date()
              }
            : ticket
        ));
      }
      
      // Generate invoices for the completed sales
      setTimeout(() => {
        payment.pendingSalesToComplete.forEach(saleId => {
          generateInvoice(saleId);
        });
      }, 100);
    }
    
    // Handle advance payment approval - update service ticket
    if (payment && paymentData.status === 'approved' && payment.paymentType === 'advance_payment' && payment.serviceTicketId) {
      // Calculate total advance from all approved advance payments for this ticket
      const allAdvancePayments = servicePayments.map(p => 
        p.id === id ? { ...p, ...paymentData } : p
      ).filter(p => 
        p.serviceTicketId === payment.serviceTicketId && 
        p.paymentType === 'advance_payment' && 
        p.status === 'approved'
      );
      
      const totalAdvance = allAdvancePayments.reduce((sum, p) => sum + p.amount, 0);
      
      setServiceTickets(serviceTickets.map(ticket => 
        ticket.id === payment.serviceTicketId
          ? { 
              ...ticket, 
              totalAdvancePaid: totalAdvance,
              updatedAt: new Date()
            }
          : ticket
      ));
    }
    
    // Handle refund payment approval - update service ticket
    if (payment && paymentData.status === 'approved' && payment.paymentType === 'refund' && payment.serviceTicketId) {
      setServiceTickets(serviceTickets.map(ticket => 
        ticket.id === payment.serviceTicketId
          ? { 
              ...ticket, 
              totalRefundGiven: (ticket.totalRefundGiven || 0) + payment.amount,
              updatedAt: new Date()
            }
          : ticket
      ));
    }
  };

  const value = {
    products,
    customers,
    suppliers,
    sales,
    purchases,
    courses,
    invoices,
    serviceTickets,
    technicians,
    serviceInvoices,
    courseBatches,
    students,
    admissions,
    enrollments,
    coursePayments,
    paymentVouchers,
    attendanceRecords,
    attendanceSessions,
    servicePayments,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    addSupplier,
    addSale,
    addPurchase,
    addCourse,
    updateCourse,
    deleteCourse,
    generateInvoice,
    updateInvoice,
    updateStock,
    addServiceTicket,
    updateServiceTicket,
    addTechnician,
    generateServiceInvoice,
    addCourseBatch,
    updateCourseBatch,
    deleteCourseBatch,
    addStudent,
    updateStudent,
    deleteStudent,
    addAdmission,
    updateAdmission,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    addCoursePayment,
    updateCoursePayment,
    deleteCoursePayment,
    generatePaymentVoucher,
    addAttendanceSession,
    updateAttendanceRecord,
    addServicePayment,
    updateServicePayment,
    deleteServicePayment: (id) => {
      setServicePayments(servicePayments.filter(payment => payment.id !== id));
    },
    deleteServiceTicket
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
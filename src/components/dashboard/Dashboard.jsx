import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { StatsGrid } from './StatsGrid';
import { LowStockAlert } from './LowStockAlert';
import { RecentSales } from './RecentSales';

export function Dashboard() {
  const { products, customers, sales, courses, serviceTickets } = useInventory();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const totalCustomers = customers.length;
  const activeCourses = courses.filter(course => course.status === 'active').length;
  const activeServiceTickets = serviceTickets.filter(ticket => 
    ['received', 'diagnosed', 'in_progress'].includes(ticket.status)
  ).length;

  const recentSales = sales.slice(-5).reverse();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your inventory management system</p>
      </div>

      <StatsGrid 
        totalRevenue={totalRevenue}
        totalProducts={products.length}
        totalCustomers={totalCustomers}
        activeServiceTickets={activeServiceTickets}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert products={lowStockProducts} />
        <RecentSales sales={recentSales} />
      </div>
    </div>
  );
}
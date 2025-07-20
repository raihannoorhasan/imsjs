import React from 'react';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../common/Card';

export function StatsGrid({ totalRevenue, totalProducts, totalCustomers, activeServiceTickets }) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      change: '+12.5%',
      changeType: 'positive',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      change: '+3',
      changeType: 'positive',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Customers',
      value: totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      change: '+8',
      changeType: 'positive',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Active Services',
      value: activeServiceTickets.toString(),
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      change: '+2',
      changeType: 'positive',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const ChangeIcon = stat.changeType === 'positive' ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <ChangeIcon size={16} />
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  vs last month
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(85 + (index * 5), 95)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
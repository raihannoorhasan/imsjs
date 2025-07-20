import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    serviceTickets: true,
    paymentReminders: false,
    systemUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const handleToggle = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    // Save notification settings logic here
    console.log('Notification settings saved:', notifications);
  };

  const NotificationToggle = ({ label, description, field }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => handleToggle(field)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          notifications[field] ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            notifications[field] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Alert Preferences</h2>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <NotificationToggle
            label="Low Stock Alerts"
            description="Get notified when products are running low"
            field="lowStock"
          />
          <NotificationToggle
            label="New Orders"
            description="Receive alerts for new customer orders"
            field="newOrders"
          />
          <NotificationToggle
            label="Service Tickets"
            description="Notifications for new service requests"
            field="serviceTickets"
          />
          <NotificationToggle
            label="Payment Reminders"
            description="Reminders for overdue invoices"
            field="paymentReminders"
          />
          <NotificationToggle
            label="System Updates"
            description="Important system and security updates"
            field="systemUpdates"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Delivery Methods</h2>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <NotificationToggle
            label="Email Notifications"
            description="Receive notifications via email"
            field="emailNotifications"
          />
          <NotificationToggle
            label="SMS Notifications"
            description="Get text message alerts"
            field="smsNotifications"
          />
          <NotificationToggle
            label="Push Notifications"
            description="Browser push notifications"
            field="pushNotifications"
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
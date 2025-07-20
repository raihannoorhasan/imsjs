import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    companyName: 'Hi Tech Computer',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    taxRate: 10,
    lowStockThreshold: 5
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={settings.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
          
          <Select
            label="Currency"
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </Select>
          
          <Select
            label="Timezone"
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST - Eastern Time</option>
            <option value="PST">PST - Pacific Time</option>
            <option value="GMT">GMT - Greenwich Mean Time</option>
          </Select>
          
          <Select
            label="Date Format"
            value={settings.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </Select>
          
          <Select
            label="Language"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Select>
          
          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.1"
            value={settings.taxRate}
            onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
          />
        </div>
        
        <Input
          label="Low Stock Alert Threshold"
          type="number"
          value={settings.lowStockThreshold}
          onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value))}
          className="md:w-1/2"
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}
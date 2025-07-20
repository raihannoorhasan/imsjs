import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiry: 90
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password change logic here
    console.log('Password change requested');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSecuritySave = () => {
    // Save security settings logic here
    console.log('Security settings saved:', securitySettings);
  };

  const SecurityToggle = ({ label, description, field }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => handleSecurityChange(field, !securitySettings[field])}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          securitySettings[field] ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            securitySettings[field] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            required
          />
          
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            required
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            required
          />
          
          <div className="flex justify-end">
            <Button type="submit">
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Preferences</h2>
        
        <div className="space-y-6">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <SecurityToggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              field="twoFactorAuth"
            />
            <SecurityToggle
              label="Login Notifications"
              description="Get notified of new login attempts"
              field="loginNotifications"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
            />
            
            <Input
              label="Password Expiry (days)"
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSecuritySave}>
              Save Security Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
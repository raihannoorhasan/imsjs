import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function UserSettings() {
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    role: 'Administrator',
    department: 'IT'
  });

  const handleChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save user info logic here
    console.log('User info saved:', userInfo);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Profile</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={userInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          
          <Input
            label="Last Name"
            value={userInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          
          <Input
            label="Email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          
          <Input
            label="Phone"
            type="tel"
            value={userInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          
          <Input
            label="Role"
            value={userInfo.role}
            onChange={(e) => handleChange('role', e.target.value)}
            disabled
          />
          
          <Input
            label="Department"
            value={userInfo.department}
            onChange={(e) => handleChange('department', e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Update Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
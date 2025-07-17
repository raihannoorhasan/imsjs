import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export function UserForm({ isOpen, onClose, user, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    role: 'operator',
    status: 'active'
  });
  const [showPassword, setShowPassword] = useState(!user);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '',
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      });
      setShowPassword(false);
    } else {
      setFormData({
        username: '',
        password: '',
        email: '',
        name: '',
        role: 'operator',
        status: 'active'
      });
      setShowPassword(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    
    // Don't update password if it's empty during edit
    if (user && !formData.password) {
      delete submitData.password;
    }
    
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <option value="operator">Operator</option>
            <option value="admin">Administrator</option>
          </Select>
        </div>

        {showPassword && (
          <Input
            label={user ? "New Password (leave empty to keep current)" : "Password"}
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required={!user}
          />
        )}

        {user && !showPassword && (
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPassword(true)}
            >
              Change Password
            </Button>
          </div>
        )}

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
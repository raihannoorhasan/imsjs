import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Upload, User, GraduationCap, Calendar, MapPin, Phone, Mail, Users } from 'lucide-react';

export function StudentForm({ isOpen, onClose, student, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    educationLevel: '',
    institution: '',
    fieldOfStudy: '',
    workExperience: '',
    currentOccupation: '',
    profileImage: '',
    nationalId: '',
    guardianName: '',
    guardianPhone: '',
    medicalConditions: '',
    specialNeeds: ''
  });

  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || '',
        address: student.address || '',
        city: student.city || '',
        state: student.state || '',
        zipCode: student.zipCode || '',
        country: student.country || '',
        emergencyContactName: student.emergencyContactName || '',
        emergencyContactPhone: student.emergencyContactPhone || '',
        emergencyContactRelation: student.emergencyContactRelation || '',
        educationLevel: student.educationLevel || '',
        institution: student.institution || '',
        fieldOfStudy: student.fieldOfStudy || '',
        workExperience: student.workExperience || '',
        currentOccupation: student.currentOccupation || '',
        profileImage: student.profileImage || '',
        nationalId: student.nationalId || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        medicalConditions: student.medicalConditions || '',
        specialNeeds: student.specialNeeds || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        educationLevel: '',
        institution: '',
        fieldOfStudy: '',
        workExperience: '',
        currentOccupation: '',
        profileImage: '',
        nationalId: '',
        guardianName: '',
        guardianPhone: '',
        medicalConditions: '',
        specialNeeds: ''
      });
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact & Emergency', icon: Phone },
    { id: 'additional', label: 'Additional Info', icon: Users }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
        <div className="relative">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-10 h-10 text-blue-600" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
            <Upload size={14} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-600">Upload profile picture (optional)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          className="font-medium"
        />
        
        <Input
          label="National ID / SSN"
          value={formData.nationalId}
          onChange={(e) => handleChange('nationalId', e.target.value)}
          placeholder="Enter ID number"
        />
        
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          required
        />
        
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Current Occupation"
          value={formData.currentOccupation}
          onChange={(e) => handleChange('currentOccupation', e.target.value)}
          placeholder="e.g., Student, Engineer, etc."
        />
        
        <Input
          label="Work Experience (years)"
          type="number"
          value={formData.workExperience}
          onChange={(e) => handleChange('workExperience', e.target.value)}
          placeholder="0"
          min="0"
        />
      </div>
    </div>
  );

  const renderEducationInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Education Level"
          value={formData.educationLevel}
          onChange={(e) => handleChange('educationLevel', e.target.value)}
          required
        >
          <option value="">Select Education Level</option>
          <option value="high_school">High School</option>
          <option value="diploma">Diploma</option>
          <option value="associate">Associate Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="other">Other</option>
        </Select>
        
        <Input
          label="Institution/School"
          value={formData.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder="Name of last attended institution"
        />
      </div>
      
      <Input
        label="Field of Study"
        value={formData.fieldOfStudy}
        onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
        placeholder="e.g., Computer Science, Engineering, etc."
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      {/* Primary Contact */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Primary Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address, apartment, suite, etc."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <Input
              label="State/Province"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            <Input
              label="ZIP/Postal Code"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
            />
          </div>
          <Input
            label="Country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="e.g., United States"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-medium text-red-900 mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Contact Name"
            value={formData.emergencyContactName}
            onChange={(e) => handleChange('emergencyContactName', e.target.value)}
            required
          />
          <Input
            label="Contact Phone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
            required
          />
          <Select
            label="Relationship"
            value={formData.emergencyContactRelation}
            onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
            required
          >
            <option value="">Select Relationship</option>
            <option value="parent">Parent</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="friend">Friend</option>
            <option value="guardian">Guardian</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      {/* Guardian Information (for minors) */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Guardian Information (if applicable)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Guardian Name"
            value={formData.guardianName}
            onChange={(e) => handleChange('guardianName', e.target.value)}
            placeholder="Required for students under 18"
          />
          <Input
            label="Guardian Phone"
            type="tel"
            value={formData.guardianPhone}
            onChange={(e) => handleChange('guardianPhone', e.target.value)}
            placeholder="Guardian contact number"
          />
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
        <textarea
          value={formData.medicalConditions}
          onChange={(e) => handleChange('medicalConditions', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Any medical conditions or allergies we should be aware of..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs or Accommodations</label>
        <textarea
          value={formData.specialNeeds}
          onChange={(e) => handleChange('specialNeeds', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Any special accommodations or learning needs..."
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'education':
        return renderEducationInfo();
      case 'contact':
        return renderContactInfo();
      case 'additional':
        return renderAdditionalInfo();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold">
            {student ? 'Edit Student Profile' : 'Add New Student'}
          </span>
        </div>
      }
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {activeTab !== 'additional' && (
              <span>Complete all required fields to continue</span>
            )}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {student ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
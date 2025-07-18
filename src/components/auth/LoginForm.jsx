import { Eye, EyeOff, Lock, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const demoCredentials = [
    { role: 'Admin', username: 'admin', password: 'admin123' },
    { role: 'Operator', username: 'operator', password: 'operator123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hi Tech Computer</h1>
          <p className="text-gray-600 mt-2">Inventory Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">Please sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Admin:</span>
                <div className="text-gray-500">
                  <span className="mr-2">admin</span>
                  <span>/ admin1234</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Operator:</span>
                <div className="text-gray-500">
                  <span className="mr-2">operator</span>
                  <span>/ operator1234</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Instructor:</span>
                <div className="text-gray-500">
                  <span className="mr-2">instructor</span>
                  <span>/ instructor1234</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Role Descriptions */}
          {/* <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Role Access:</h3>
            <div className="space-y-1 text-xs text-blue-600">
              <div>• <strong>Admin:</strong> Full system access</div>
              <div>• <strong>Operator:</strong> Limited management access</div>
              <div>• <strong>Instructor:</strong> Attendance management only</div>
            </div>
          </div> */}

          {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-600">{cred.role}:</span>
                  <div className="text-gray-500">
                    <span className="mr-2">{cred.username}</span>
                    <span>/ {cred.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2024 Hi Tech Computer. All rights reserved R.
          </p>
        </div>
      </div>
    </div>
  );
}

        
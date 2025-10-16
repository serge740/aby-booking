import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  User,
  ArrowLeft 
} from 'lucide-react';
import useAdminAuth from '../../../context/AdminAuthContext';
import { API_URL } from '../../../api/api';

const UnlockScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  
  const { user, unlockAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Real-time validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }

    // Show validation error in real-time if field has been touched
    if (touched && value !== '') {
      const validationError = validatePassword(value);
      if (validationError && validationError !== 'Password is required') {
        setError(validationError);
      }
    }
  };

  const handlePasswordBlur = () => {
    setTouched(true);
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await unlockAdmin(password);
      
      if (response) {
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Unlock error:', err);
      setError(err.message || 'Invalid password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      // Logout to clear the locked state
      // This ensures the user goes back to a clean login state
      navigate('/auth/admin/login', { replace: true });
    } catch (error) {
      console.error('Error navigating back to login:', error);
      navigate('/auth/admin/login', { replace: true });
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return password && !validatePassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Screen Locked</h2>
            <p className="text-gray-600">Enter your password to unlock</p>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-primary-50 rounded-xl">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profileImg ? (
                <img 
                  src={`${API_URL}${user.profileImg}`} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary-600" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">{user?.adminName || 'Admin'}</p>
              <p className="text-sm text-gray-600">{user?.adminEmail}</p>
              <p className="text-xs text-primary-600 font-medium">Administrator</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Unlock Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-primary-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    error && touched
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Unlock
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={handleBackToLogin}
              disabled={isSubmitting}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            For security, your session was locked after a period of inactivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnlockScreen;
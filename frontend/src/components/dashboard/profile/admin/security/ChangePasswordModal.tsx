import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import adminAuthService, { changePassword } from '../../../../../services/adminAuthService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Errors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, adminId }) => {
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Validation functions
  const validateOldPassword = (password: string): string => {
    if (!password) return 'Current password is required';
    return '';
  };

  const validateNewPassword = (password: string): string => {
    if (!password) return 'New password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must include at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must include at least one special character';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, newPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your new password';
    if (confirmPassword !== newPassword) return 'Passwords do not match';
    return '';
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {
      oldPassword: validateOldPassword(formData.oldPassword),
      newPassword: validateNewPassword(formData.newPassword),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.newPassword),
    };
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof Errors]) delete newErrors[key as keyof Errors];
    });
    return newErrors;
  };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Compute the new form data
  const nextFormData = { ...formData, [name]: value };
  setFormData(nextFormData);

  // Validate old and new password
  const newErrors: Errors = {
    oldPassword: validateOldPassword(nextFormData.oldPassword),
    newPassword: validateNewPassword(nextFormData.newPassword),
  };

  // Custom confirm password validation
  if (!nextFormData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your new password';
  } else if (nextFormData.confirmPassword !== nextFormData.newPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  // Remove empty errors
  Object.keys(newErrors).forEach((key) => {
    if (!newErrors[key as keyof Errors]) delete newErrors[key as keyof Errors];
  });

  setErrors(newErrors);
};


  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await adminAuthService.changePassword({
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      Swal.fire({
        title: 'Password Changed',
        text: 'Your password has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      }).then(() => {
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        onClose();
      });
    } catch (error: any) {
        console.log(error);
        
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to change password. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.oldPassword ? 'text' : 'password'}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${
                  errors.oldPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter current password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, oldPassword: !prev.oldPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPasswords.oldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.oldPassword && <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${
                  errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, newPassword: !prev.newPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPasswords.newPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPasswords.confirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                Password should be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Settings, Trash2, Power } from 'lucide-react';
import useAdminAuth from '../../../../context/AdminAuthContext';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangePasswordModal from './security/ChangePasswordModal';
import { useCompanyAuth } from '../../../../context/CompanyAuthContext';

interface AdminUser {
  id: string;
  adminName?: string;
  adminEmail?: string;
  isLocked?: boolean;
  createdAt?: string;
  profileImage?: string;
  phone?: string;
  is2FA?: boolean;
  google_id?: string;
}

const SecuritySettings: React.FC = () => {
  const { user, updateAdmin, loginWithGoogle } = useCompanyAuth() as any ;

  
  const [googleConnected, setGoogleConnected] = useState(!!user?.google_id);
  const [phoneVerified] = useState(true);
  const [emailVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update googleConnected state when user changes
  useEffect(() => {
    setGoogleConnected(!!user?.google_id);
  }, [user?.google_id]);

  // Check URL parameters for status=notfound and acceptance=0
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const acceptance = queryParams.get("acceptance");

    if (status === "notfound" && acceptance === "0") {
      Swal.fire({
        title: "Account Not Found",
        text: "The Google account you tried to use is not associated with any admin account. Please sign in with a different method or contact support.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        textColor: "#1f2937",
        titleColor: "#1f2937",
      }).then(() => {
        navigate(location.pathname, { replace: true });
      });
    }
  }, [location.search, navigate]);

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };



  const handleGoogleToggle = async () => {
    try {
      const action = googleConnected ? 'disconnect' : 'connect';
      const result = await Swal.fire({
        title: `Are you sure you want to ${action} Google Authentication?`,
        text: googleConnected
          ? 'This will disconnect your Google account.'
          : 'This will connect your Google account.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}`,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        if (googleConnected) {
          if (!user?.id) {
            throw new Error('No logged-in admin to update');
          }
          await updateAdmin({ id: user.id, google_id: '' });
          setGoogleConnected(false);
          Swal.fire({
            title: 'Google Disconnected',
            text: 'Google Authentication has been disconnected successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2563eb',
            textColor: '#1f2937',
            titleColor: '#1f2937',
          });
        } else {
          const url = `${window.location.href}`;
          loginWithGoogle(true, url);
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || `Failed to ${googleConnected ? 'disconnect' : 'connect'} Google Authentication. Please try again.`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });
    } finally {
      if (googleConnected) {
        setIsLoading(false);
      }
    }
  };

  const handleRemovePhone = async () => {
    const result = await Swal.fire({
      title: 'Remove Phone Number',
      text: 'Are you sure you want to remove your phone number?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      textColor: '#1f2937',
      titleColor: '#1f2937',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Phone Number Removed',
        text: 'Your phone number has been removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });
    }
  };

  const handleChangePhone = () => {
    Swal.fire({
      title: 'Change Phone Number',
      text: 'A modal to change your phone number would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb',
      textColor: '#1f2937',
      titleColor: '#1f2937',
    });
  };

  const handleRemoveEmail = async () => {
    const result = await Swal.fire({
      title: 'Remove Email',
      text: 'Are you sure you want to remove your email?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      textColor: '#1f2937',
      titleColor: '#1f2937',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Email Removed',
        text: 'Your email has been removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });
    }
  };

  const handleChangeEmail = () => {
    Swal.fire({
      title: 'Change Email',
      text: 'A modal to change your email would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb',
      textColor: '#1f2937',
      titleColor: '#1f2937',
    });
  };



  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete your account? Your account will be permanently deleted and cannot be recovered.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      textColor: '#1f2937',
      titleColor: '#1f2937',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Account Deletion Initiated',
        text: 'Your account deletion has been initiated.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        textColor: '#1f2937',
        titleColor: '#1f2937',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Password Section */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-0.5">Password</h3>
          <p className="text-xs text-gray-500 mb-0.5">Set a unique password to protect the account</p>
          <p className="text-xs text-gray-400">Last Changed 03 Jan 2024, 09:00 AM</p>
        </div>
        <button
          onClick={handleChangePassword}
          className="px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        >
          Change Password
        </button>
      </div>

    

      {/* Google Authentication */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-0.5">
            <h3 className="text-sm font-medium text-gray-900">Google Authentication</h3>
            {googleConnected && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                ✓ Connected
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">Connect to Google</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleGoogleToggle}
            className={`px-3 py-1.5 text-xs font-medium rounded focus:outline-none focus:ring-2 ${
              googleConnected
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {googleConnected ? 'Disconnecting...' : 'Connecting...'}
              </div>
            ) : googleConnected ? (
              'Disconnect'
            ) : (
              'Connect'
            )}
          </button>
        </div>
      </div>

      {/* Phone Number Verification */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-0.5">
            <h3 className="text-sm font-medium text-gray-900">Phone Number Verification</h3>
            {phoneVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
          <p className="text-xs text-gray-500 mb-0.5">The phone number associated with the account</p>
          <p className="text-xs text-gray-600">Verified Mobile Number: {user?.phone || '+99264710583'}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRemovePhone}
            className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-red-600 focus:outline-none"
            disabled={isLoading}
          >
            Remove
          </button>
          <button
            onClick={handleChangePhone}
            className="px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            Change
          </button>
        </div>
      </div>

      {/* Email Verification */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-0.5">
            <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
            {emailVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
          <p className="text-xs text-gray-500 mb-0.5">The email address associated with the account</p>
          <p className="text-xs text-gray-600">Verified Email: {user?.adminEmail || 'info@example.com'}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRemoveEmail}
            className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-red-600 focus:outline-none"
            disabled={isLoading}
          >
            Remove
          </button>
          <button
            onClick={handleChangeEmail}
            className="px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            Change
          </button>
        </div>
      </div>

    
      {/* Delete Account */}
      <div className="flex items-center justify-between py-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-600 mb-0.5">Delete Account</h3>
          <p className="text-xs text-gray-500">Your account will be permanently deleted</p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        adminId={user?.id || ''}
      />
    </div>
  );
};

export default SecuritySettings;
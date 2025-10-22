import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAdminAuth  from '../../../../context/AdminAuthContext';

interface User {
  id: number;
  names: string;
  email: string;

  role: { name: string };
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  names: string;
  email: string;
  
  created_at: string;
}

const ProfileSettings: React.FC = () => {
  const { user, updateProfile } = useAdminAuth() as any;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    names: user?.names || '',
    email: user?.email || '',
   
    created_at: user?.created_at || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      names: user?.names || '',
      email: user?.email || '',
     
      created_at: user?.createdAt || '',
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatePayload: Partial<User> = {
        names: formData.names,
        email: formData.email,
       
      };

      await updateProfile(updatePayload);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#2563eb', // primary-600
        textColor: '#1f2937', // gray-800
        titleColor: '#1f2937', // gray-800
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating your profile.',
        confirmButtonColor: '#ef4444', // red-500
        textColor: '#1f2937', // gray-800
        titleColor: '#1f2937', // gray-800
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      names: user?.names || '',
      email: user?.email || '',
    
      created_at: user?.created_at || '',
    });
    setIsEditing(false);
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <>
      {/* Profile Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Basic Information
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="names"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="names"
              name="names"
              value={formData.names}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label
              htmlFor="created_at"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Account Created
            </label>
            <input
              type="datetime-local"
              id="created_at"
              name="created_at"
              value={formatDate(formData.created_at)}
              readOnly
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-4 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 transition-colors"
          >
            Update
          </button>
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1.5 bg-primary-500 text-white text-xs font-medium rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
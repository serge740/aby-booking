import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../../../context/EmployeeAuthContext';
import { API_URL } from '../../../../api/api';
import { Camera, Mail, Phone, MapPin, Calendar, Briefcase, Building2, User, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const EmployeeProfileSettings = () => {
  const { user: employee, updateEmployee, refreshProfile } = useEmployeeAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    position: '',
    bank_name: '',
    bank_account_number: '',
  });

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        date_of_birth: employee.date_of_birth ? new Date(employee.date_of_birth).toISOString().split('T')[0] : '',
        position: employee.position || '',
        bank_name: employee.bank_name || '',
        bank_account_number: employee.bank_account_number || '',
      });
      if (employee.profile_picture) {
        setPreviewImg(`${API_URL}${employee.profile_picture}`);
      }
    }
  }, [employee]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!employee?.id) return;

    setIsSaving(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));
      if (selectedFile) form.append('profile_picture', selectedFile);

      await updateEmployee(form);
      await refreshProfile(); // Ensure UI is fresh

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your profile has been saved.',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsEditing(false);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!employee) {
    return (
      <div className="text-center py-8 text-gray-500">
        No employee data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
            {previewImg ? (
              <img src={previewImg} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {employee.first_name} {employee.last_name}
          </h3>
          <p className="text-sm text-gray-500">{employee.position}</p>
          <p className="text-xs text-gray-400">Employee ID: {employee.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 mr-1" /> Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 mr-1" /> Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 mr-1" /> Address
          </label>
          <textarea
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            disabled={!isEditing}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50 resize-none"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 mr-1" /> Date of Birth
          </label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={e => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Briefcase className="w-4 h-4 mr-1" /> Position
          </label>
          <input
            type="text"
            value={formData.position}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Building2 className="w-4 h-4 mr-1" /> Bank Name
          </label>
          <input
            type="text"
            value={formData.bank_name}
            onChange={e => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Bank Account</label>
          <input
            type="text"
            value={formData.bank_account_number}
            onChange={e => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfileSettings;
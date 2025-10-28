
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Building2, Mail, Phone, MapPin, FileText, Upload, Eye, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useCompanyAuth } from '../../../../context/CompanyAuthContext';
import { API_URL } from '../../../../api/api';

const COMPANY_TYPES = ['RESTAURANT', 'SUPERMARKET', 'SHOP', 'HOTEL', 'BAR', 'LOUNGE', 'OTHER'];

const CompanyProfileSettings = () => {
  const { company, updateProfile } = useCompanyAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    logo: null,
    address: '',
    city: '',
    country: '',
    type: 'OTHER',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        description: company.description || '',
        logo: null,
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        type: company.type || 'OTHER',
        isActive: company.isActive !== undefined ? company.isActive : true,
        createdAt: company.createdAt || '',
        updatedAt: company.updatedAt || '',
      });
      if (company.logo) {
        setLogoPreview(`${API_URL}${company.logo}`);
      }
    }
  }, [company]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, logo: file }));
        setLogoPreview(URL.createObjectURL(file));
        if (errors.logo) {
          setErrors((prev) => ({ ...prev, logo: '' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, logo: 'Please upload a valid image file (PNG, JPG, JPEG)' }));
      }
    }
  };

  const clearLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (errors.logo) {
      setErrors((prev) => ({ ...prev, logo: '' }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, logo: file }));
        setLogoPreview(URL.createObjectURL(file));
        if (errors.logo) {
          setErrors((prev) => ({ ...prev, logo: '' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, logo: 'Please drop a valid image file (PNG, JPG, JPEG)' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.type) newErrors.type = 'Company type is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        type: formData.type,
        isActive: formData.isActive,
      };

      await updateProfile(updatePayload, formData.logo);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your company profile has been updated successfully.',
        confirmButtonColor: '#2563eb', // blue-600
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
      name: company?.name || '',
      email: company?.email || '',
      phone: company?.phone || '',
      description: company?.description || '',
      logo: null,
      address: company?.address || '',
      city: company?.city || '',
      country: company?.country || '',
      type: company?.type || 'OTHER',
      isActive: company?.isActive !== undefined ? company.isActive : true,
      createdAt: company?.createdAt || '',
      updatedAt: company?.updatedAt || '',
    });
    setLogoPreview(company?.logo ? `${API_URL}${company.logo}` : null);
    setErrors({});
    setIsEditing(false);
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <>
      {/* Profile Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter company name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="type" className="block text-xs font-medium text-gray-600 mb-1">
              Company Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
            >
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
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
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="company@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Street address"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-1.5 border border-gray-200 rounded text-xs ${
                isEditing
                  ? 'focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Country"
            />
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
          </div>
          <div>
            <label htmlFor="isActive" className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-xs text-gray-600">
                Company is active
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="createdAt" className="block text-xs font-medium text-gray-600 mb-1">
              Created At
            </label>
            <input
              type="datetime-local"
              id="createdAt"
              name="createdAt"
              value={formatDate(formData.createdAt)}
              readOnly
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="updatedAt" className="block text-xs font-medium text-gray-600 mb-1">
              Updated At
            </label>
            <input
              type="datetime-local"
              id="updatedAt"
              name="updatedAt"
              value={formatDate(formData.updatedAt)}
              readOnly
              className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

       

        {/* Logo Upload */}
        <div className="mt-8">
          <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
            <Upload className="w-4 h-4 mr-2" />
            Company Logo
          </label>
          <div
            className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm ${
              !isEditing ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs">Company Logo</h3>
                <p className="text-xs text-gray-500">Upload one high-quality image</p>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo"
                disabled={!isEditing}
              />
              <label htmlFor="logo" className="cursor-pointer">
                <div
                  className={`p-3 rounded-full w-fit mx-auto transition-colors ${
                    isDragging ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 ${
                      isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                    }`}
                  />
                </div>
                <p className="mt-3 font-medium text-gray-900 text-xs">
                  {isDragging ? 'Drop image here' : 'Drop image here or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
              </label>
            </div>

            {logoPreview && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="h-24 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(logoPreview)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                      disabled={!isEditing}
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={clearLogo}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                      disabled={!isEditing}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errors.logo && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <X className="h-4 w-4" />
                {errors.logo}
              </p>
            )}
          </div>
        </div>
         {/* Description */}
        <div className="mt-4">
          <label htmlFor="description" className="flex items-center text-xs font-medium text-gray-600 mb-1">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </label>
          <div
            className={`border border-gray-200 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
              isEditing ? '' : 'bg-gray-100 cursor-not-allowed'
            } ${errors.description ? 'border-red-500' : ''}`}
          >
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              readOnly={!isEditing}
              placeholder="Brief description of your company"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean'],
                ],
              }}
              
            />
          </div>
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Buttons */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
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
            className="px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </>
  );
};

export default CompanyProfileSettings;

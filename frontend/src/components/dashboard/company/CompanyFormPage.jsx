import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Building2, Mail, Phone, MapPin, FileText, Upload, Eye, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import companyService from '../../../services/companyService';
import { API_URL } from '../../../api/api';

const COMPANY_TYPES = ['RESTAURANT', 'SUPERMARKET', 'SHOP', 'HOTEL', 'BAR', 'LOUNGE', 'OTHER'];

export default function CompanyFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    logo: null, // File object or null
    address: '',
    city: '',
    country: '',
    type: 'OTHER',
    isActive: true,
  });
  const [logoPreview, setLogoPreview] = useState(null); // For previewing logo
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const totalSteps = 3;

  useEffect(() => {
    if (isEditMode) {
      const fetchCompanyData = async () => {
        try {
          const company = await companyService.getCompanyById(id);
          setFormData({
            name: company.name || '',
            email: company.email || '',
            phone: company.phone || '',
            description: company.description || '',
            logo: null, // File input starts empty
            address: company.address || '',
            city: company.city || '',
            country: company.country || '',
            type: company.type || 'OTHER',
            isActive: company.isActive !== undefined ? company.isActive : true,
          });
        
          if (company.logo) {
            setLogoPreview(`${API_URL}${company.logo}`); // Set existing logo URL for preview
          }
        } catch (err) {
          setErrors({ fetch: err.message || 'Failed to load company data' });
        }
      };
      fetchCompanyData();
    }
  }, [id, isEditMode]);

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
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Company name is required';
      if (!formData.type) newErrors.type = 'Company type is required';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    
    if (!validateStep(currentStep)) return console.log('shit #@#@#');

    setIsSubmitting(true);
    console.log('shiet #@#@#');

    try {
      const dataToSubmit = {
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

      if (isEditMode) {
        await companyService.updateCompany(id, dataToSubmit, formData.logo);
        alert('Company updated successfully!');
        navigate('/admin/dashboard/company');
      } else {
        await companyService.createCompany(dataToSubmit, formData.logo);
        alert('Company created successfully!');
        navigate('/admin/dashboard/company');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save company' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const stepLabels = ['Basic Info', 'Location', 'Review'];

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between  mx-auto">
          {stepLabels.map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white shadow-lg'
                      : currentStep === index + 1
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > index + 1 ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < stepLabels.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-colors duration-300 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-4 h-4 mr-2" />
          Company Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter company name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-4 h-4 mr-2" />
          Company Type *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {COMPANY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="company@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 mr-2" />
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="+1 234 567 8900"
        />
      </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            

        </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 mr-2" />
          Description
        </label>
        <div className={`border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent outline-none transition ${errors.description ? 'border-red-500' : ''}`}>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
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
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

    
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Street address"
        />
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Country"
          />
          {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
        </div>
      </div>
        {/* Updated Logo Upload Field */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Upload className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Company Logo</h3>
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
            <p className="mt-3 font-medium text-gray-900">
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
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={clearLogo}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
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
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="text-base font-medium text-gray-900">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="text-base font-medium text-gray-900">{formData.type}</p>
          </div>
          {formData.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900">{formData.email}</p>
            </div>
          )}
          {formData.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-900">{formData.phone}</p>
            </div>
          )}
          {formData.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formData.description }} />
            </div>
          )}
          {logoPreview && (
            <div>
              <p className="text-sm text-gray-500">Logo</p>
              <img
                src={logoPreview}
                alt="Company logo"
                className="w-24 h-24 object-contain rounded-lg border border-gray-200"
              />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-base font-medium text-gray-900">
              {formData.address}, {formData.city}, {formData.country}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-base font-medium text-gray-900">{formData.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          Company is active
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Update Company' : 'Create New Company'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update your company information' : 'Fill in the details to register your company'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errors.fetch && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
              {errors.fetch}
            </div>
          )}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
              {errors.submit}
            </div>
          )}
          {renderStepIndicator()}
          <div >
            <div className="min-h-[400px]">{renderCurrentStep()}</div>
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                type="submit"
                onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {isEditMode ? 'Update Company' : 'Create Company'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
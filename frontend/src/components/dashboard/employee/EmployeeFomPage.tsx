// src/pages/EmployeeFormPage.jsx
import React, { useEffect, useState, memo } from 'react';
import {
  ChevronLeft, ChevronRight, User, FileText, Briefcase, Upload, X, Eye,
  Calendar, Plus, Trash2, Save, Check, Mail, Phone, MapPin, CreditCard,
  Building2, AlertCircle, Users
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../../../services/employeeService';
import { API_URL } from '../../../api/api';
import Swal from 'sweetalert2';

const MARITAL_STATUS = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as const;
const EMPLOYEE_STATUS = ['ACTIVE', 'TERMINATED', 'RESIGNED', 'PROBATION'] as const;
const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;

type MaritalStatus = typeof MARITAL_STATUS[number];
type EmployeeStatus = typeof EMPLOYEE_STATUS[number];
type Gender = typeof GENDERS[number];

interface Experience {
  company_name: string;
  description: string;
  start_date: string;
  end_date?: string;
}

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  national_id: string;
  position: string;
  marital_status: MaritalStatus;
  date_hired: string;
  status: EmployeeStatus;
  bank_account_number: string;
  bank_name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  experience: Experience[];
}

// Updated FileState to include identityCardImage
interface FileState {
  profileImg: File | null;
  applicationLetter: File | null;
  cv: File | null;
  identityCardImage: File | null; // NEW
}

interface PreviewFileState {
  profileImg: string | null;
  applicationLetter: string | null;
  cv: string | null;
  identityCardImage: string | null; // NEW
}

interface RemovedFileState {
  profileImg: boolean;
  applicationLetter: boolean;
  cv: boolean;
  identityCardImage: boolean; // NEW
}

interface Errors { [key: string]: string | null; }

const steps = [
  { title: 'Personal Info', icon: User, description: 'Basic information' },
  { title: 'Documents', icon: FileText, description: 'Upload files' },
  { title: 'Experience', icon: Briefcase, description: 'Work history' },
  { title: 'Review', icon: Check, description: 'Confirm details' },
];

/* -------------------------------------------------------------------------- */
/*                         RE-USABLE UI COMPONENTS                            */
/* -------------------------------------------------------------------------- */
const InputField = memo(({ label, icon: Icon, required, error, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-xs font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    />
    {error && (
      <p className="flex items-center text-xs text-red-600 mt-1">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
));

const SelectField = memo(({ label, icon: Icon, required, error, children, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-xs font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {children}
    </select>
    {error && (
      <p className="flex items-center text-xs text-red-600 mt-1">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
));

const FileUpload = memo(
  ({
    label,
    fileType,
    accept,
    required = false,
    files,
    previewFiles,
    existingFiles,
    removedFiles,
    errors,
    onFileChange,
    onRemove,
  }: {
    label: string;
    fileType: keyof FileState;
    accept: string;
    required?: boolean;
    files: FileState;
    previewFiles: PreviewFileState;
    existingFiles: PreviewFileState;
    removedFiles: RemovedFileState;
    errors: Errors;
    onFileChange: (type: keyof FileState, file: File | null) => void;
    onRemove: (type: keyof FileState) => void;
  }) => {
    const hasFile = files[fileType] || (existingFiles[fileType] && !removedFiles[fileType]);
    const showRequired = required && !hasFile;

    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          {label} {showRequired && <span className="text-red-500">*</span>}
        </label>
        {hasFile ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-primary-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {files[fileType]?.name || existingFiles[fileType]?.split('/').pop()}
                    {existingFiles[fileType] && !files[fileType] && (
                      <span className="ml-2 text-xs text-primary-600">(Existing)</span>
                    )}
                  </p>
                  {files[fileType] && (
                    <p className="text-xs text-gray-500">
                      {(files[fileType]!.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                {previewFiles[fileType] && (
                  <button
                    type="button"
                    onClick={() => window.open(previewFiles[fileType]!)}
                    className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(fileType)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {fileType === 'profileImg' && previewFiles[fileType] && (
              <img
                src={previewFiles[fileType]!}
                alt="Preview"
                className="mt-3 h-24 w-24 object-cover rounded-xl border-2 border-primary-200"
              />
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={e => onFileChange(fileType, e.target.files?.[0] || null)}
              className="hidden"
              id={fileType}
            />
            <label htmlFor={fileType} className="cursor-pointer">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-xs font-medium text-gray-700">Click to upload {label.toLowerCase()}</p>
              <p className="text-xs text-gray-500 mt-1">{accept}</p>
            </label>
          </div>
        )}
        {errors[fileType] && (
          <p className="flex items-center text-xs text-red-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors[fileType]}
          </p>
        )}
      </div>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                               STEP COMPONENTS                               */
/* -------------------------------------------------------------------------- */
const PersonalInfoStep = memo(
  ({
    formData,
    errors,
    onChange,
  }: {
    formData: EmployeeFormData;
    errors: Errors;
    onChange: (field: keyof EmployeeFormData, value: string) => void;
  }) => (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" icon={User} required value={formData.first_name} onChange={e => onChange('first_name', e.target.value)} placeholder="Enter first name" error={errors.first_name} />
          <InputField label="Last Name" icon={User} required value={formData.last_name} onChange={e => onChange('last_name', e.target.value)} placeholder="Enter last name" error={errors.last_name} />
          <SelectField label="Gender" icon={Users} required value={formData.gender} onChange={e => onChange('gender', e.target.value)} error={errors.gender}>
            <option value="">Select Gender</option>
            {GENDERS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </SelectField>
          <InputField label="Date of Birth" icon={Calendar} type="date" required value={formData.date_of_birth} onChange={e => onChange('date_of_birth', e.target.value)} error={errors.date_of_birth} />
        </div>
      </div>
      {/* Contact Information */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-primary-600" /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Email Address" icon={Mail} type="email" required value={formData.email} onChange={e => onChange('email', e.target.value)} placeholder="email@example.com" error={errors.email} />
          <InputField label="Phone Number" icon={Phone} type="tel" required value={formData.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+250 XXX XXX XXX" error={errors.phone} />
          <InputField label="National ID" required value={formData.national_id} onChange={e => onChange('national_id', e.target.value)} placeholder="1 XXXX X XXXXXXX X XX" error={errors.national_id} />
        </div>
        <div className="mt-4">
          <label className="flex items-center text-xs font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> Address <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.address}
            onChange={e => onChange('address', e.target.value)}
            rows={3}
            placeholder="Enter full address"
            className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.address && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.address}
            </p>
          )}
        </div>
      </div>
      {/* Employment Details */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary-600" /> Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Position" icon={Briefcase} required value={formData.position} onChange={e => onChange('position', e.target.value)} placeholder="e.g., Software Engineer" error={errors.position} />
          <InputField label="Date Hired" icon={Calendar} type="date" required value={formData.date_hired} onChange={e => onChange('date_hired', e.target.value)} error={errors.date_hired} />
          <SelectField label="Marital Status" value={formData.marital_status} onChange={e => onChange('marital_status', e.target.value)}>
            {MARITAL_STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
          <SelectField label="Employment Status" value={formData.status} onChange={e => onChange('status', e.target.value)}>
            {EMPLOYEE_STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectField>
        </div>
      </div>
      {/* Banking & Emergency */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-primary-600" /> Banking & Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Bank Name" icon={Building2} value={formData.bank_name} onChange={e => onChange('bank_name', e.target.value)} placeholder="e.g., Bank of Kigali" error={errors.bank_name} />
          <InputField label="Bank Account Number" icon={CreditCard} value={formData.bank_account_number} onChange={e => onChange('bank_account_number', e.target.value)} placeholder="XXXX XXXX XXXX" error={errors.bank_account_number} />
          <InputField label="Emergency Contact Name" icon={User} value={formData.emergency_contact_name} onChange={e => onChange('emergency_contact_name', e.target.value)} placeholder="Full name" error={errors.emergency_contact_name} />
          <InputField label="Emergency Contact Phone" icon={Phone} type="tel" value={formData.emergency_contact_phone} onChange={e => onChange('emergency_contact_phone', e.target.value)} placeholder="+250 XXX XXX XXX" error={errors.emergency_contact_phone} />
        </div>
      </div>
    </div>
  )
);

const DocumentsStep = memo(
  ({
    files,
    previewFiles,
    existingFiles,
    removedFiles,
    errors,
    onFileChange,
    onRemove,
  }: {
    files: FileState;
    previewFiles: PreviewFileState;
    existingFiles: PreviewFileState;
    removedFiles: RemovedFileState;
    errors: Errors;
    onFileChange: (type: keyof FileState, file: File | null) => void;
    onRemove: (type: keyof FileState) => void;
  }) => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
        <p className="text-xs text-gray-600 mt-1">Please upload the required documents</p>
      </div>
      <FileUpload label="Profile Picture" fileType="profileImg" accept="image/*" files={files} previewFiles={previewFiles} existingFiles={existingFiles} removedFiles={removedFiles} errors={errors} onFileChange={onFileChange} onRemove={onRemove} />
      <FileUpload label="Application Letter" fileType="applicationLetter" accept=".pdf,.doc,.docx" required files={files} previewFiles={previewFiles} existingFiles={existingFiles} removedFiles={removedFiles} errors={errors} onFileChange={onFileChange} onRemove={onRemove} />
      <FileUpload label="CV/Resume" fileType="cv" accept=".pdf,.doc,.docx" files={files} previewFiles={previewFiles} existingFiles={existingFiles} removedFiles={removedFiles} errors={errors} onFileChange={onFileChange} onRemove={onRemove} />
      {/* NEW: Identity Card Upload */}
      <FileUpload
        label="Identity Card"
        fileType="identityCardImage"
        accept=".pdf,.jpg,.jpeg,.png"
        required
        files={files}
        previewFiles={previewFiles}
        existingFiles={existingFiles}
        removedFiles={removedFiles}
        errors={errors}
        onFileChange={onFileChange}
        onRemove={onRemove}
      />
    </div>
  )
);

const ExperienceStep = memo(
  ({
    experience,
    errors,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    experience: Experience[];
    errors: Errors;
    onAdd: () => void;
    onUpdate: (idx: number, field: keyof Experience, value: string) => void;
    onRemove: (idx: number) => void;
  }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary-600" /> Work Experience
          </h3>
          <p className="text-xs text-gray-600 mt-1">Add your previous work experience</p>
        </div>
        <button type="button" onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> <span>Add Experience</span>
        </button>
      </div>
      {experience.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <button type="button" onClick={onAdd} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xs font-semibold text-primary-600">{i + 1}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Experience {i + 1}</h4>
                </div>
                <button onClick={() => onRemove(i)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  placeholder="Company Name *"
                  value={exp.company_name}
                  onChange={e => onUpdate(i, 'company_name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors[`exp_${i}_company`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors[`exp_${i}_company`] && (
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors[`exp_${i}_company`]}
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={e => onUpdate(i, 'start_date', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors[`exp_${i}_start`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors[`exp_${i}_start`] && (
                      <p className="text-xs text-red-600 flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors[`exp_${i}_start`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={exp.end_date || ''}
                      onChange={e => onUpdate(i, 'end_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Job Description *"
                  value={exp.description}
                  onChange={e => onUpdate(i, 'description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors[`exp_${i}_desc`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors[`exp_${i}_desc`] && (
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors[`exp_${i}_desc`]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
);

const ReviewStep = memo(
  ({
    formData,
    files,
    existingFiles,
    removedFiles,
    previewFiles,
    errors,
  }: {
    formData: EmployeeFormData;
    files: FileState;
    existingFiles: PreviewFileState;
    removedFiles: RemovedFileState;
    previewFiles: PreviewFileState;
    errors: Errors;
  }) => {
    const hasFile = (type: keyof FileState) => files[type] || (existingFiles[type] && !removedFiles[type]);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Review Your Information</h3>
          <p className="text-xs text-gray-600 mt-2">Please review all details before submitting</p>
        </div>
        <div className="space-y-6">
          {/* Personal */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" /> Personal Information
            </h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium text-gray-900">{formData.first_name} {formData.last_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Gender:</span><span className="font-medium text-gray-900">{formData.gender}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium text-gray-900">{formData.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-medium text-gray-900">{formData.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Date of Birth:</span><span className="font-medium text-gray-900">{formData.date_of_birth}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">National ID:</span><span className="font-medium text-gray-900">{formData.national_id}</span></div>
            </div>
          </div>
          {/* Employment */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary-600" /> Employment Details
            </h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-600">Position:</span><span className="font-medium text-gray-900">{formData.position}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{formData.status}</span>
              </div>
              <div className="flex justify-between"><span className="text-gray-600">Date Hired:</span><span className="font-medium text-gray-900">{formData.date_hired}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Marital Status:</span><span className="font-medium text-gray-900">{formData.marital_status}</span></div>
            </div>
          </div>
          {/* Documents */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" /> Documents
            </h4>
            <div className="space-y-2 text-xs">
              {(['profileImg', 'applicationLetter', 'cv', 'identityCardImage'] as const).map(type => (
                <div key={type} className="flex items-center justify-between py-2">
                  <span className="text-gray-600">
                    {type === 'profileImg' ? 'Profile Picture' :
                     type === 'applicationLetter' ? 'Application Letter' :
                     type === 'cv' ? 'CV/Resume' : 'Identity Card'}
                  </span>
                  <span className={`font-medium ${hasFile(type) ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasFile(type) ? 'Uploaded' : '— Not uploaded'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Experience */}
          {formData.experience.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" /> Work Experience ({formData.experience.length})
              </h4>
              <div className="space-y-4">
                {formData.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-primary-500 pl-4 py-2">
                    <p className="font-medium text-gray-900">{exp.company_name}</p>
                    <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{exp.start_date} - {exp.end_date || 'Present'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.general && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{errors.general}</p>
          </div>
        )}
      </div>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE COMPONENT                           */
/* -------------------------------------------------------------------------- */
const EmployeeFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [previewFiles, setPreviewFiles] = useState<PreviewFileState>({ profileImg: null, applicationLetter: null, cv: null, identityCardImage: null });
  const [existingFiles, setExistingFiles] = useState<PreviewFileState>({ profileImg: null, applicationLetter: null, cv: null, identityCardImage: null });
  const [removedFiles, setRemovedFiles] = useState<RemovedFileState>({ profileImg: false, applicationLetter: false, cv: false, identityCardImage: false });
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '', last_name: '', gender: '' as Gender, date_of_birth: '', phone: '', email: '',
    address: '', national_id: '', position: '', marital_status: 'SINGLE', date_hired: '',
    status: 'ACTIVE', bank_account_number: '', bank_name: '', emergency_contact_name: '',
    emergency_contact_phone: '', experience: [],
  });
  const [files, setFiles] = useState<FileState>({ profileImg: null, applicationLetter: null, cv: null, identityCardImage: null });
  const navigate = useNavigate();
  const { id: employeeId } = useParams<{ id?: string }>();

  const getUrlImage = (url?: string) => (url && !url.includes('http') ? `${API_URL}${url}` : url);

  // Load employee on edit
  useEffect(() => {
    if (employeeId) loadEmployeeData();
  }, [employeeId]);

  const loadEmployeeData = async () => {
    try {
      setIsLoading(true);
      const employee = await employeeService.getEmployeeById(employeeId!);
      const parsedExp: Experience[] = typeof employee.experience === 'string'
        ? JSON.parse(employee.experience || '[]')
        : employee.experience || [];

      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        gender: employee.gender as Gender,
        date_of_birth: new Date(employee.date_of_birth).toISOString().split('T')[0],
        phone: employee.phone,
        email: employee.email,
        address: employee.address,
        national_id: employee.national_id,
        position: employee.position,
        marital_status: employee.marital_status || 'SINGLE',
        date_hired: new Date(employee.date_hired).toISOString().split('T')[0],
        status: employee.status,
        bank_account_number: employee.bank_account_number || '',
        bank_name: employee.bank_name || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        experience: parsedExp,
      });

      const urls = {
        profileImg: getUrlImage(employee.profile_picture),
        applicationLetter: getUrlImage(employee.application_letter),
        cv: getUrlImage(employee.cv),
        identityCardImage: getUrlImage(employee.identity_card), // Adjust field name if needed
      };
      setExistingFiles(urls);
      setPreviewFiles(urls);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Failed to load employee', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleFileChange = (fileType: keyof FileState, file: File | null) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setPreviewFiles(prev => ({ ...prev, [fileType]: e.target?.result as string }));
      reader.readAsDataURL(file);
      setRemovedFiles(prev => ({ ...prev, [fileType]: false }));
    } else {
      setPreviewFiles(prev => ({
        ...prev,
        [fileType]: existingFiles[fileType] && !removedFiles[fileType] ? existingFiles[fileType] : null,
      }));
    }
    if (errors[fileType]) setErrors(prev => ({ ...prev, [fileType]: null }));
  };

  const removeFile = (fileType: keyof FileState) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
    setPreviewFiles(prev => ({ ...prev, [fileType]: null }));
    if (existingFiles[fileType]) setRemovedFiles(prev => ({ ...prev, [fileType]: true }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company_name: '', description: '', start_date: '', end_date: '' }],
    }));
  };

  const updateExperience = (idx: number, field: keyof Experience, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === idx ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};
    switch (step) {
      case 0:
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.national_id.trim()) newErrors.national_id = 'National ID is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.date_hired) newErrors.date_hired = 'Hire date is required';
        break;
      case 1:
        const hasApp = files.applicationLetter || (existingFiles.applicationLetter && !removedFiles.applicationLetter);
        if (!hasApp) newErrors.applicationLetter = 'Application letter is required';

        const hasId = files.identityCardImage || (existingFiles.identityCardImage && !removedFiles.identityCardImage);
        if (!hasId) newErrors.identityCardImage = 'Identity Card is required'; // Required
        break;
      case 2:
        formData.experience.forEach((exp, i) => {
          if (!exp.company_name.trim()) newErrors[`exp_${i}_company`] = 'Company name required';
          if (!exp.description.trim()) newErrors[`exp_${i}_desc`] = 'Description required';
          if (!exp.start_date) newErrors[`exp_${i}_start`] = 'Start date required';
        });
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)); };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Submit
  const createFormData = (): FormData => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, k === 'experience' ? JSON.stringify(v) : v));
    if (files.profileImg) data.append('profileImg', files.profileImg);
    if (files.applicationLetter) data.append('applicationLetter', files.applicationLetter);
    if (files.cv) data.append('cv', files.cv);
    if (files.identityCardImage) data.append('identityCardImage', files.identityCardImage); // NEW
    const removed = Object.entries(removedFiles).filter(([_, v]) => v).map(([k]) => k);
    if (removed.length) data.append('removedFiles', JSON.stringify(removed));
    return data;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    try {
      setIsLoading(true);
      const form = createFormData();
      const action = employeeId ? 'updated' : 'created';
      await (employeeId ? employeeService.updateEmployee(employeeId, form) : employeeService.createEmployee(form));
      Swal.fire('Success!', `Employee ${action} successfully!`, 'success').then(() => navigate('/company/dashboard/employee'));
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Operation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} errors={errors} onChange={handleInputChange} />;
      case 1:
        return (
          <DocumentsStep
            files={files}
            previewFiles={previewFiles}
            existingFiles={existingFiles}
            removedFiles={removedFiles}
            errors={errors}
            onFileChange={handleFileChange}
            onRemove={removeFile}
          />
        );
      case 2:
        return (
          <ExperienceStep
            experience={formData.experience}
            errors={errors}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={formData}
            files={files}
            existingFiles={existingFiles}
            removedFiles={removedFiles}
            previewFiles={previewFiles}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading && employeeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="mx-auto ">
        {/* Header & Progress */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">{employeeId ? 'Update Employee' : 'Create New Employee'}</h1>
            <p className="text-primary-100 text-xs mt-1">Fill in the employee information step by step</p>
          </div>
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === currentStep;
                const isCompleted = i < currentStep;
                return (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isActive ? 'bg-primary-600 text-white shadow-lg scale-110' :
                          'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        {isActive && <span className="absolute -inset-1 bg-primary-400 rounded-full animate-ping opacity-75"></span>}
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-xs font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 mb-8 rounded-full transition-all duration-300 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">{renderStep()}</div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm px-8 py-5 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="px-5 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            Cancel
          </button>
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button onClick={prevStep} className="flex items-center space-x-2 px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <ChevronLeft className="h-4 w-4" /> <span>Previous</span>
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button onClick={nextStep} className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md font-medium">
                <span>Next Step</span> <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{employeeId ? 'Update Employee' : 'Create Employee'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormPage;
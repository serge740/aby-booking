import React, { useState, useEffect, memo } from 'react';
import {
  User, Mail, Phone, MapPin, Lock, Camera, Save, X, Edit2,
  CheckCircle, AlertCircle, Eye, EyeOff, Building2, Calendar,
  Shield, FileText, Download, Trash2, Loader2,
  Bell,
  MessageCircleCode
} from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';
import { API_URL } from '../../../api/api';
import Swal from 'sweetalert2';
import PushNotificationPage from '../PushNotificationPage';

/* -------------------------------------------------------------------------- */
/*                     REUSABLE INPUT COMPONENTS (unchanged)                 */
/* -------------------------------------------------------------------------- */
interface InputFieldProps { label: string; icon?: React.ComponentType<{ className?: string }>; error?: string | null; readOnly?: boolean; [key: string]: any; }
const InputField: React.FC<InputFieldProps> = memo(({ label, icon: Icon, error, readOnly, ...props }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
      {label}
    </label>
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 ${
        readOnly
          ? 'bg-gray-50 text-gray-600 cursor-not-allowed'
          : 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
      } ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
    />
    {error && (
      <p className="flex items-center text-xs text-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
));

interface SelectFieldProps { label: string; icon?: React.ComponentType<{ className?: string }>; error?: string | null; children: React.ReactNode; [key: string]: any; }
const SelectField: React.FC<SelectFieldProps> = memo(({ label, icon: Icon, error, children, ...props }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
      {label}
    </label>
    <select
      {...props}
      disabled={props.disabled}
      className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 ${
        props.disabled
          ? 'bg-gray-50 text-gray-600 cursor-not-allowed'
          : 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
      } ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      {children}
    </select>
    {error && (
      <p className="flex items-center text-xs text-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
));

interface PasswordFieldProps {
  label: string;
  field: 'current' | 'new' | 'confirm';
  error?: string | null;
  showPassword: { current: boolean; new: boolean; confirm: boolean };
  togglePassword: (field: 'current' | 'new' | 'confirm') => void;
  [key: string]: any;
}
const PasswordField: React.FC<PasswordFieldProps> = memo(({ label, field, error, showPassword, togglePassword, ...props }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-medium text-gray-700">
      <Lock className="w-4 h-4 mr-1.5 text-gray-400" />
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        type={showPassword[field] ? 'text' : 'password'}
        className={`w-full px-4 py-2.5 pr-10 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      <button
        type="button"
        onClick={() => togglePassword(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
    {error && (
      <p className="flex items-center text-xs text-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
));

/* -------------------------------------------------------------------------- */
/*                         DocumentUpload (unchanged)                         */
/* -------------------------------------------------------------------------- */
interface DocumentUploadProps {
  label: string;
  file: File | null;
  existingPath?: string | null;
  onChange: (file: File | null) => void;
  isEditing: boolean;
}
const DocumentUpload: React.FC<DocumentUploadProps> = memo(({ label, file, existingPath, onChange, isEditing }) => {
  const url = existingPath ? `${API_URL}${existingPath}` : null;
  const hasFile = file || url;
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
        {label}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 transition-all ${hasFile ? 'border-orange-300 bg-orange-50' : 'border-gray-300'}`}>
        {hasFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">
                {file?.name || label + ' (Uploaded)'}
              </span>
            </div>
            <div className="flex space-x-2">
              {url && (
                <>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                    <Eye className="w-4 h-4" />
                  </a>
                  <a href={url} download className="text-green-600 hover:text-green-700">
                    <Download className="w-4 h-4" />
                  </a>
                </>
              )}
              {isEditing && (
                <button onClick={() => onChange(null)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">No file uploaded</p>
            {isEditing && (
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">
                Upload File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
interface PasswordData { currentPassword: string; newPassword: string; confirmPassword: string; }
interface Errors { [key: string]: string | null; }

const EmployeeProfilePage: React.FC = () => {
  const { user, updateEmployee, changePassword, isLoading: authLoading, refreshProfile } = useEmployeeAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'documents' | 'notifications'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState({ /* same as before */ });
  const [passwordData, setPasswordData] = useState<PasswordData>({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // ---- NEW FILE STATES ----
  const [previewImage, setPreviewImage] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applicationLetterFile, setApplicationLetterFile] = useState<File | null>(null);
  const [identityCardFile, setIdentityCardFile] = useState<File | null>(null);          // NEW
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  /* ---------------------------------------------------------------------- */
  /*                              LOAD USER DATA                            */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || '',
        national_id: user.national_id || '',
        position: user.position || '',
        marital_status: user.marital_status || '',
        bank_account_number: user.bank_account_number || '',
        bank_name: user.bank_name || '',
        emergency_contact_name: user.emergency_contact_name || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
        date_hired: user.date_hired ? new Date(user.date_hired).toISOString().split('T')[0] : '',
      });

      // Profile picture
      if (user.profile_picture) {
        setPreviewImage(`${API_URL}${user.profile_picture}`);
      } else {
        setPreviewImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&size=200&background=2563eb&color=fff`);
      }

      // Reset files
      setProfilePictureFile(null);
      setCvFile(null);
      setApplicationLetterFile(null);
      setIdentityCardFile(null);               // NEW
      setRemovedFiles([]);
    }
  }, [user]);

  /* ---------------------------------------------------------------------- */
  /*                              INPUT HANDLERS                            */
  /* ---------------------------------------------------------------------- */
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const togglePassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (
    type: 'profileImg' | 'cv' | 'applicationLetter' | 'identityCardImage',   // NEW type
    file: File | null
  ) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ [type]: 'File size should be less than 10MB' });
      return;
    }

    if (type === 'profileImg') {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = e => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
      setRemovedFiles(prev => prev.filter(f => f !== 'profileImg'));
    } else if (type === 'cv') {
      setCvFile(file);
      setRemovedFiles(prev => prev.filter(f => f !== 'cv'));
    } else if (type === 'applicationLetter') {
      setApplicationLetterFile(file);
      setRemovedFiles(prev => prev.filter(f => f !== 'applicationLetter'));
    } else if (type === 'identityCardImage') {               // NEW
      setIdentityCardFile(file);
      setRemovedFiles(prev => prev.filter(f => f !== 'identityCardImage'));
    }
  };

  const removeFile = (type: 'profileImg' | 'cv' | 'applicationLetter' | 'identityCardImage') => {
    if (type === 'profileImg') {
      setProfilePictureFile(null);
      setPreviewImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name + ' ' + user?.last_name)}&size=200&background=2563eb&color=fff`);
    } else if (type === 'cv') {
      setCvFile(null);
    } else if (type === 'applicationLetter') {
      setApplicationLetterFile(null);
    } else if (type === 'identityCardImage') {               // NEW
      setIdentityCardFile(null);
    }
    setRemovedFiles(prev => [...prev, type]);
  };

  /* ---------------------------------------------------------------------- */
  /*                               VALIDATION                               */
  /* ---------------------------------------------------------------------- */
  const validatePersonalInfo = (): boolean => {
    const newErrors: Errors = {};
    if (!profileData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!profileData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!profileData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!profileData.gender) newErrors.gender = 'Gender is required';
    if (!profileData.national_id.trim()) newErrors.national_id = 'National ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: Errors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------------------------------------------------------------- */
  /*                               SAVE PROFILE                               */
  /* ---------------------------------------------------------------------- */
  const handleSaveProfile = async () => {
    if (!validatePersonalInfo()) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (profilePictureFile) formData.append('profileImg', profilePictureFile);
      if (cvFile) formData.append('cv', cvFile);
      if (applicationLetterFile) formData.append('applicationLetter', applicationLetterFile);
      if (identityCardFile) formData.append('identityCardImage', identityCardFile);   // NEW
      if (removedFiles.length > 0) formData.append('removedFiles', JSON.stringify(removedFiles));

      await updateEmployee(formData);
      await refreshProfile();
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      Swal.fire({ title: 'Success!', text: 'Profile updated!', icon: 'success', confirmButtonColor: '#2563eb' });
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      Swal.fire({ title: 'Success!', text: 'Password changed!', icon: 'success', confirmButtonColor: '#2563eb' });
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                                   UI                                   */
  /* ---------------------------------------------------------------------- */
  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: MessageCircleCode },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="mx-auto ">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Header & Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-orange-100 text-sm mt-1">Manage your account and documents</p>
              </div>
              {activeTab === 'personal' && (
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all shadow-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-8 px-8 overflow-x-auto ">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsEditing(false);
                      setErrors({});
                    }}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-all ${
                      isActive ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-start space-x-6 pb-6 border-b">
                <div className="relative">
                  <img src={previewImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg" />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange('profileImg', e.target.files?.[0] || null)} className="hidden" id="profile-picture" />
                      <label htmlFor="profile-picture" className="flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full cursor-pointer hover:bg-orange-700 shadow-lg">
                        <Camera className="w-5 h-5" />
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mt-1">Max size 10MB.</p>
                  {isEditing && (profilePictureFile || user?.profile_picture) && (
                    <button onClick={() => removeFile('profileImg')} className="mt-3 flex items-center text-sm text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" /> Remove Picture
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-600" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="First Name" icon={User} value={profileData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} error={errors.first_name} readOnly={!isEditing} />
                  <InputField label="Last Name" icon={User} value={profileData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} error={errors.last_name} readOnly={!isEditing} />
                  <InputField label="Email Address" icon={Mail} type="email" value={profileData.email} onChange={(e) => handleInputChange('email', e.target.value)} error={errors.email} readOnly={!isEditing} />
                  <InputField label="Phone Number" icon={Phone} type="tel" value={profileData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} error={errors.phone} readOnly={!isEditing} />
                  <SelectField label="Gender" icon={User} value={profileData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} error={errors.gender} disabled={!isEditing}>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </SelectField>
                  <InputField label="Date of Birth" icon={Calendar} type="date" value={profileData.date_of_birth} onChange={(e) => handleInputChange('date_of_birth', e.target.value)} error={errors.date_of_birth} readOnly={!isEditing} />
                  <InputField label="National ID" value={profileData.national_id} onChange={(e) => handleInputChange('national_id', e.target.value)} error={errors.national_id} readOnly={!isEditing} />
                  <SelectField label="Marital Status" value={profileData.marital_status} onChange={(e) => handleInputChange('marital_status', e.target.value)} disabled={!isEditing}>
                    <option value="">Select Status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                  </SelectField>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-600" /> Address
                </h3>
                <textarea
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2.5 border rounded-lg transition-all ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>

              {/* Professional */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-orange-600" /> Professional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Employee ID" value={user?.id || ''} readOnly />
                  <InputField label="Position" icon={Building2} value={profileData.position} readOnly />
                  <InputField label="Date Hired" icon={Calendar} type="date" value={profileData.date_hired} readOnly />
                  <InputField label="Status" value={user?.status || ''} readOnly />
                </div>
              </div>

              {/* Banking & Emergency */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" /> Banking & Emergency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Bank Name" icon={Building2} value={profileData.bank_name} onChange={(e) => handleInputChange('bank_name', e.target.value)} readOnly={!isEditing} />
                  <InputField label="Bank Account" value={profileData.bank_account_number} onChange={(e) => handleInputChange('bank_account_number', e.target.value)} readOnly={!isEditing} />
                  <InputField label="Emergency Name" icon={User} value={profileData.emergency_contact_name} onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)} readOnly={!isEditing} />
                  <InputField label="Emergency Phone" icon={Phone} type="tel" value={profileData.emergency_contact_phone} onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)} readOnly={!isEditing} />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" /> Change Password
                </h3>
                <div className="grid lg:grid-cols-2 gap-3 space-y-4">
                  <PasswordField label="Current Password" field="current" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} error={errors.currentPassword} showPassword={showPassword} togglePassword={togglePassword} />
                  <PasswordField label="New Password" field="new" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} error={errors.newPassword} showPassword={showPassword} togglePassword={togglePassword} />
                  <div className="col-span-1 md:col-span-2">
                    <PasswordField label="Confirm Password" field="confirm" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} error={errors.confirmPassword} showPassword={showPassword} togglePassword={togglePassword} />
                  </div>
                  <button onClick={handleChangePassword} disabled={isLoading} className="w-full col-span-1 lg:col-span-2 flex items-center justify-center space-x-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Lock className="w-4 h-4" /> Change Password</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {
            activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-600" /> Push Notifications
                </h3>
             <PushNotificationPage />
              </div>
            )
          }

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" /> My Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                  <DocumentUpload
                    label="Identity Card"
                    file={identityCardFile}
                    existingPath={user?.identityCardImage}
                    onChange={(file) => handleFileChange('identityCardImage', file)}
                    isEditing={isEditing}
                  />
                <DocumentUpload label="CV / Resume" file={cvFile} existingPath={user?.cv} onChange={(file) => handleFileChange('cv', file)} isEditing={isEditing} />
                <DocumentUpload label="Application Letter" file={applicationLetterFile} existingPath={user?.application_letter} onChange={(file) => handleFileChange('applicationLetter', file)} isEditing={isEditing} />
              </div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">Contact HR to update other documents.</p>
              </div>
            </div>
          )}
        </div>

        {/* Cancel / Save Buttons (only on personal tab when editing) */}
        {activeTab === 'personal' && isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setErrors({});
                if (user) {
                  setProfileData({ /* reset all fields – same as in useEffect */ });
                  setProfilePictureFile(null);
                  setCvFile(null);
                  setApplicationLetterFile(null);
                  setIdentityCardFile(null);               // NEW
                  setRemovedFiles([]);
                  if (user.profile_picture) setPreviewImage(`${API_URL}${user.profile_picture}`);
                }
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              <X className="w-4 h-4 inline mr-2" /> Cancel
            </button>
            <button onClick={handleSaveProfile} disabled={isLoading} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium">
              {isLoading ? <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 inline mr-2" /> Save Changes</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
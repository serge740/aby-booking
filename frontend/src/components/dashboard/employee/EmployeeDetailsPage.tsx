// src/pages/EmployeeDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, CreditCard,
  FileText, AlertCircle, Building2, Shield, Clock, ArrowLeft,
  Eye, Download
} from 'lucide-react';
import employeeService from '../../../services/employeeService';
import { API_URL } from '../../../api/api';
import Swal from 'sweetalert2';

// Same as form
interface Experience {
  company_name: string;
  description: string;
  start_date: string;
  end_date?: string;
}

const getUrlImage = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.includes('http')) return url;
  return `${API_URL}${url}`;
};

const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load employee');
        Swal.fire('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const parseExperience = (exp: any): Experience[] => {
    if (!exp) return [];
    try {
      return typeof exp === 'string' ? JSON.parse(exp) : exp;
    } catch {
      return [];
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      TERMINATED: 'bg-red-100 text-red-800',
      RESIGNED: 'bg-gray-100 text-gray-800',
      PROBATION: 'bg-yellow-100 text-yellow-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const calculateTenure = (hireDate: string) => {
    const diff = Date.now() - new Date(hireDate).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${years} years, ${months} months`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-700">Employee not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const experienceList: Experience[] = parseExperience(employee.experience);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Employee Details</h1>
            <p className="text-gray-500 mt-1">Complete information about the employee</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {employee.profile_picture ? (
                <img
                  src={getUrlImage(employee.profile_picture)!}
                  alt={`${employee.first_name} ${employee.last_name}`}
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <p className="text-lg text-gray-600 mt-1">{employee.position}</p>
                  <p className="text-sm text-gray-500 mt-1">Employee ID: {employee.id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Hired: {formatDate(employee.date_hired)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Tenure: {calculateTenure(employee.date_hired)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{employee.company?.name || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Full Name" value={`${employee.first_name} ${employee.last_name}`} />
              <InfoRow label="Gender" value={employee.gender} />
              <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
              <InfoRow label="Marital Status" value={employee.marital_status || '—'} />
              <InfoRow label="National ID" value={employee.national_id} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" /> Contact Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Email" value={employee.email} icon={<Mail className="w-4 h-4" />} />
              <InfoRow label="Phone" value={employee.phone} icon={<Phone className="w-4 h-4" />} />
              <InfoRow label="Address" value={employee.address} icon={<MapPin className="w-4 h-4" />} />
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Banking Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Bank Name" value={employee.bank_name || '—'} />
              <InfoRow label="Account Number" value={employee.bank_account_number || '—'} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Emergency Contact
            </h3>
            <div className="space-y-3">
              <InfoRow label="Contact Name" value={employee.emergency_contact_name || '—'} />
              <InfoRow label="Contact Phone" value={employee.emergency_contact_phone || '—'} />
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Company Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Company Name" value={employee.company?.name || '—'} />
              <InfoRow label="Industry" value={employee.company?.industry || '—'} />
              <InfoRow label="Location" value={employee.company?.location || '—'} />
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security Settings
            </h3>
            <div className="space-y-3">
              <InfoRow
                label="Two-Factor Authentication"
                value={employee.is2FA ? (
                  <span className="text-green-600 font-medium">Enabled</span>
                ) : (
                  <span className="text-gray-500">Disabled</span>
                )}
              />
              <InfoRow
                label="Account Status"
                value={employee.isLocked ? (
                  <span className="text-red-600 font-medium">Locked</span>
                ) : (
                  <span className="text-green-600 font-medium">Active</span>
                )}
              />
              <InfoRow
                label="Google Sign-In"
                value={employee.google_id ? (
                  <span className="text-green-600 font-medium">Connected</span>
                ) : (
                  <span className="text-gray-500">Not Connected</span>
                )}
              />
            </div>
          </div>
        </div>

        {/* Work Experience */}
        {experienceList.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Work Experience
            </h3>
            <div className="space-y-6">
              {experienceList.map((exp, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">{exp.company_name || 'Unknown Company'}</h4>
                  <p className="text-gray-600 mt-1">{exp.description || 'No description'}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(exp.start_date)} – {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentLink label="CV/Resume" url={getUrlImage(employee.cv)} />
            <DocumentLink label="Application Letter" url={getUrlImage(employee.application_letter)} />
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gray-100 rounded-lg p-4 mt-6 text-sm text-gray-600">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Created: {formatDate(employee.createdAt)}</span>
            <span>Last Updated: {formatDate(employee.updatedAt)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Components
const InfoRow = ({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 font-medium flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className="text-gray-900 text-right ml-4">{value ?? '—'}</span>
  </div>
);

const DocumentLink = ({ label, url }: { label: string; url?: string }) => {
  if (!url) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-400 text-sm">Not uploaded</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-700">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => window.open(url, '_blank')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <Eye className="w-4 h-4" /> View
        </button>
        <a
          href={url}
          download
          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
        >
          <Download className="w-4 h-4" /> Download
        </a>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
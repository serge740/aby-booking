import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, CreditCard,
  FileText, AlertCircle, Building2, Shield, Clock, ArrowLeft,
  Eye, Download, Info, Contact, Landmark, Users, Lock, Award
} from 'lucide-react';
import employeeService from '../../../services/employeeService';
import { API_URL } from '../../../api/api';
import Swal from 'sweetalert2';

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
  const [activeTab, setActiveTab] = useState('overview');
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
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      TERMINATED: 'bg-red-50 text-red-700 border-red-200',
      RESIGNED: 'bg-slate-50 text-slate-700 border-slate-200',
      PROBATION: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const calculateTenure = (hireDate: string) => {
    const diff = Date.now() - new Date(hireDate).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${years}y ${months}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-primary-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <p className="text-sm text-slate-700 mb-4">Employee not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const experienceList: Experience[] = parseExperience(employee.experience);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Contact },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 mb-3 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-20"></div>
            <div className="px-5 pb-5 -mt-10">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-shrink-0">
                  {employee.profile_picture ? (
                    <img
                      src={getUrlImage(employee.profile_picture)!}
                      alt={`${employee.first_name} ${employee.last_name}`}
                      className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="w-9 h-9 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 text-white ">
                        {employee.first_name} {employee.last_name}
                      </h1>
                      <div className='pt-5'>
                      <p className="text-sm text-slate-600 mt-0.5">{employee.position}</p>
                      {/* <p className="text-xs text-slate-500 mt-0.5">ID: {employee.id}</p> */}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Hired</div>
                        <div className="text-xs font-medium">{formatDate(employee.date_hired)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Tenure</div>
                        <div className="text-xs font-medium">{calculateTenure(employee.date_hired)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500">Company</div>
                        <div className="text-xs font-medium">{employee.company?.name || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoCard title="Personal Info" icon={User}>
                <InfoRow label="Full Name" value={`${employee.first_name} ${employee.last_name}`} />
                <InfoRow label="Gender" value={employee.gender} />
                <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                <InfoRow label="Marital Status" value={employee.marital_status} />
                <InfoRow label="National ID" value={employee.national_id} />
              </InfoCard>

              <InfoCard title="Contact" icon={Contact}>
                <InfoRow label="Email" value={employee.email} />
                <InfoRow label="Phone" value={employee.phone} />
                <InfoRow label="Address" value={employee.address} />
              </InfoCard>

              <InfoCard title="Company" icon={Building2}>
                <InfoRow label="Company" value={employee.company?.name} />
                <InfoRow label="Industry" value={employee.company?.industry} />
                <InfoRow label="Location" value={employee.company?.location} />
              </InfoCard>

              <InfoCard title="Banking" icon={Landmark}>
                <InfoRow label="Bank Name" value={employee.bank_name} />
                <InfoRow label="Account Number" value={employee.bank_account_number} />
              </InfoCard>
            </div>
          )}

          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoCard title="Personal Information" icon={User}>
                <InfoRow label="Full Name" value={`${employee.first_name} ${employee.last_name}`} />
                <InfoRow label="Gender" value={employee.gender} />
                <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                <InfoRow label="Marital Status" value={employee.marital_status} />
                <InfoRow label="National ID" value={employee.national_id} />
              </InfoCard>

              <InfoCard title="Emergency Contact" icon={AlertCircle}>
                <InfoRow label="Contact Name" value={employee.emergency_contact_name} />
                <InfoRow label="Contact Phone" value={employee.emergency_contact_phone} />
              </InfoCard>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoCard title="Contact Information" icon={Mail}>
                <InfoRow label="Email" value={employee.email} icon={<Mail className="w-3.5 h-3.5" />} />
                <InfoRow label="Phone" value={employee.phone} icon={<Phone className="w-3.5 h-3.5" />} />
                <InfoRow label="Address" value={employee.address} icon={<MapPin className="w-3.5 h-3.5" />} />
              </InfoCard>

              <InfoCard title="Emergency Contact" icon={AlertCircle}>
                <InfoRow label="Contact Name" value={employee.emergency_contact_name} />
                <InfoRow label="Contact Phone" value={employee.emergency_contact_phone} />
              </InfoCard>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoCard title="Company Information" icon={Building2}>
                <InfoRow label="Company Name" value={employee.company?.name} />
                <InfoRow label="Industry" value={employee.company?.industry} />
                <InfoRow label="Location" value={employee.company?.location} />
                <InfoRow label="Position" value={employee.position} />
                <InfoRow label="Date Hired" value={formatDate(employee.date_hired)} />
                <InfoRow label="Status" value={employee.status} />
              </InfoCard>

              <InfoCard title="Banking Information" icon={Landmark}>
                <InfoRow label="Bank Name" value={employee.bank_name} />
                <InfoRow label="Account Number" value={employee.bank_account_number} />
              </InfoCard>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <InfoCard title="Work Experience" icon={Briefcase}>
              {experienceList.length > 0 ? (
                <div className="space-y-4">
                  {experienceList.map((exp, i) => (
                    <div key={i} className="border-l-2 border-primary-500 pl-3 py-1">
                      <h4 className="text-sm font-semibold text-slate-900">{exp.company_name || 'Unknown Company'}</h4>
                      <p className="text-xs text-slate-600 mt-1">{exp.description || 'No description'}</p>
                      <p className="text-xs text-slate-500 mt-1.5">
                        {formatDate(exp.start_date)} – {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No work experience recorded</p>
              )}
            </InfoCard>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <InfoCard title="Documents" icon={FileText}>
              <div className="space-y-3">
                <DocumentLink label="CV/Resume" url={getUrlImage(employee.cv)} />
                <DocumentLink label="Application Letter" url={getUrlImage(employee.application_letter)} />
              </div>
            </InfoCard>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <InfoCard title="Security Settings" icon={Shield}>
              <InfoRow
                label="Two-Factor Authentication"
                value={employee.is2FA ? (
                  <span className="text-emerald-600 font-medium text-xs">Enabled</span>
                ) : (
                  <span className="text-slate-500 text-xs">Disabled</span>
                )}
              />
              <InfoRow
                label="Account Status"
                value={employee.isLocked ? (
                  <span className="text-red-600 font-medium text-xs">Locked</span>
                ) : (
                  <span className="text-emerald-600 font-medium text-xs">Active</span>
                )}
              />
              <InfoRow
                label="Google Sign-In"
                value={employee.google_id ? (
                  <span className="text-emerald-600 font-medium text-xs">Connected</span>
                ) : (
                  <span className="text-slate-500 text-xs">Not Connected</span>
                )}
              />
            </InfoCard>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-slate-100 rounded-lg px-4 py-3 mt-4">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
            <span>Created: {formatDate(employee.createdAt)}</span>
            <span>Last Updated: {formatDate(employee.updatedAt)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Components
const InfoCard = ({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-600" />
        {title}
      </h3>
      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) => (
  <div className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0">
    <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <span className="text-xs text-slate-900 text-right ml-4">{value ?? '—'}</span>
  </div>
);

const DocumentLink = ({ label, url }: { label: string; url?: string }) => {
  if (!url) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
        <span className="text-xs text-slate-700">{label}</span>
        <span className="text-slate-400 text-xs">Not uploaded</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
      <span className="text-xs text-slate-700 font-medium">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => window.open(url, '_blank')}
          className="text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <a
          href={url}
          download
          className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </a>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
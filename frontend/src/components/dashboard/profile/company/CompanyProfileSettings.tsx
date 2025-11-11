/* -------------------------------------------------------------------------- */
/*  CompanyProfileSettings – modern, tabbed, admin-profile-style UI          */
/* -------------------------------------------------------------------------- */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  DragEvent,
} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Eye,
  X,
  Lock,
  Loader2,
  Globe,
  Calendar,
  Download,
} from 'lucide-react';
import { useCompanyAuth } from '../../../../context/CompanyAuthContext';
import { API_URL } from '../../../../api/api';

const COMPANY_TYPES = [
  'RESTAURANT',
  'SUPERMARKET',
  'SHOP',
  'HOTEL',
  'BAR',
  'LOUNGE',
  'OTHER',
] as const;

type CompanyType = (typeof COMPANY_TYPES)[number];

interface Company {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  logo?: string; // path on server
  address?: string;
  city?: string;
  country?: string;
  type: CompanyType;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData extends Omit<Company, 'logo'> {
  logo: File | null;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                 */
/* ------------------------------------------------------------------------ */
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const calculateCompletion = (data: FormData, original?: Company) => {
  const fields = [
    data.name,
    data.type,
    data.email,
    data.phone,
    data.address,
    data.city,
    data.country,
    original?.logo,
    data.description?.trim(),
  ];
  console.log(fields);
  
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

const DocumentItem: React.FC<{ label: string; url: string; date?: string }> = ({
  label,
  url,
  date,
}) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[rgb(81,96,146)]/30 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-red-600" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        <p className="text-xs text-gray-500">
          — • Uploaded on {formatDate(date)}
        </p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-[rgb(81,96,146)] hover:bg-[rgb(81,96,146)]/10 rounded-lg transition-colors"
    >
      <Download className="w-4 h-4" />
    </a>
  </div>
);

/* ------------------------------------------------------------------------ */
/* Component                                                               */
/* ------------------------------------------------------------------------ */
const CompanyProfileSettings: React.FC = () => {
  const { company, updateProfile } = useCompanyAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- URL tab handling ----------
  const urlTab = searchParams.get('tab');
  const validTabs = ['overview', 'documents'] as const;
  type Tab = (typeof validTabs)[number];
  const activeTab: Tab = validTabs.includes(urlTab as any) ? (urlTab as Tab) : 'overview';

  const setActiveTab = (tab: Tab) => setSearchParams({ tab });

  // Ensure a tab is always present
  useEffect(() => {
    if (!searchParams.has('tab')) setSearchParams({ tab: 'overview' });
  }, [searchParams, setSearchParams]);

  // ---------- Edit mode ----------
  const editMode = searchParams.get('edit') === 'true';
  const toggleEdit = () => {
    setSearchParams((p) => {
      p.set('edit', editMode ? 'false' : 'true');
      return p;
    });
  };

  // ---------- State ----------
  const [form, setForm] = useState<FormData>({
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------- Sync with context ----------
  useEffect(() => {
    if (company) {
      const init: FormData = {
        name: company.name ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        description: company.description ?? '',
        logo: null,
        address: company.address ?? '',
        city: company.city ?? '',
        country: company.country ?? '',
        type: company.type ?? 'OTHER',
        isActive: company.isActive ?? true,
        createdAt: company.createdAt ?? '',
        updatedAt: company.updatedAt ?? '',
      };
      setForm(init);
      setLogoPreview(company.logo ? `${API_URL}${company.logo}` : null);
      setLoading(false);
    }
  }, [company]);

  // ---------- Handlers ----------
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({
        ...p,
        [name]: type === 'checkbox' ? checked : value,
      }));
      if (errors[name as keyof FormData]) setErrors((p) => ({ ...p, [name]: '' }));
    },
    [errors]
  );

  const handleQuill = useCallback((value: string) => {
    setForm((p) => ({ ...p, description: value }));
    if (errors.description) setErrors((p) => ({ ...p, description: '' }));
  }, [errors]);

  const handleLogo = useCallback(
    (file: File | null) => {
      if (!file) {
        setForm((p) => ({ ...p, logo: null }));
        setLogoPreview(null);
        return;
      }
      if (file.type.startsWith('image/')) {
        setForm((p) => ({ ...p, logo: file }));
        setLogoPreview(URL.createObjectURL(file));
        if (errors.logo) setErrors((p) => ({ ...p, logo: '' }));
      } else {
        setErrors((p) => ({ ...p, logo: 'Please upload a valid image (PNG, JPG, JPEG)' }));
      }
    },
    [errors]
  );

  const clearLogo = () => handleLogo(null);

  // Drag-and-drop
  const dragProps = {
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDragEnter: (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
    },
    onDrop: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleLogo(file);
    },
  };

  // ---------- Validation ----------
  const validate = useCallback(() => {
    const err: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) err.name = 'Company name is required';
    if (!form.type) err.type = 'Company type is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Invalid email format';
    if (!form.address.trim()) err.address = 'Address is required';
    if (!form.city.trim()) err.city = 'City is required';
    if (!form.country.trim()) err.country = 'Country is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [form]);

  // ---------- Save ----------
  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        description: form.description,
        address: form.address,
        city: form.city,
        country: form.country,
        type: form.type,
        isActive: form.isActive,
      };
      await updateProfile(payload, form.logo);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Company profile updated!',
        confirmButtonColor: '#516092',
      });
      setSearchParams((p) => {
        p.delete('edit');
        return p;
      });
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: e.message || 'Something went wrong',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------- Cancel ----------
  const cancel = () => {
    if (company) {
      const reset: FormData = {
        name: company.name ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        description: company.description ?? '',
        logo: null,
        address: company.address ?? '',
        city: company.city ?? '',
        country: company.country ?? '',
        type: company.type ?? 'OTHER',
        isActive: company.isActive ?? true,
        createdAt: company.createdAt ?? '',
        updatedAt: company.updatedAt ?? '',
      };
      setForm(reset);
      setLogoPreview(company.logo ? `${API_URL}${company.logo}` : null);
    }
    setErrors({});
    setSearchParams((p) => {
      p.delete('edit');
      return p;
    });
  };

  // ---------- Completion ----------
  const completionPct = useMemo(() => calculateCompletion(form, company), [form, company]);

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-[rgb(81,96,146)]" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-lg text-red-600">Company not found</p>
      </div>
    );
  }

  const documents = [
    company.logo && {
      label: 'Company Logo',
      url: `${API_URL}${company.logo}`,
      date: company.updatedAt,
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <div className="relative rounded-t-xl overflow-hidden h-48">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1350')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(81,96,146)]/90 to-[rgb(81,96,146)]/70" />
          </div>

          <div className="relative h-full flex items-end p-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-end gap-4">
                <div className="relative mb-[-32px]">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={form.name}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {form.isActive && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-2 border-white">
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-white">
                  <h1 className="text-2xl font-bold mb-0.5">{form.name}</h1>
                  <p className="text-white/90 text-sm mb-1.5">{form.type}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {form.city || form.country ? `${form.city}, ${form.country}` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="bg-white border-b flex gap-1 px-4">
          {(['overview', 'documents'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors capitalize ${
                activeTab === t
                  ? 'text-[rgb(81,96,146)] border-b-2 border-[rgb(81,96,146)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={toggleEdit}
            className="ml-auto px-5 py-2 my-1.5 bg-[rgb(81,96,146)] text-white rounded-lg hover:bg-[rgb(71,86,136)] transition-colors text-sm font-medium"
          >
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* ---------- Content ---------- */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {/* ---- Left Sidebar ---- */}
            <div className="space-y-4">
              {/* Completion */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Complete Your Profile
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-semibold inline-block py-0.5 px-2 uppercase rounded-full ${
                      completionPct === 100
                        ? 'text-[rgb(81,96,146)] bg-[rgb(81,96,146)]/10'
                        : completionPct >= 70
                        ? 'text-[rgb(81,96,146)] bg-[rgb(81,96,146)]/10'
                        : 'text-amber-600 bg-amber-100'
                    }`}
                  >
                    {completionPct}%
                  </span>
                </div>
                <div className="overflow-hidden h-1.5 rounded bg-gray-200">
                  <div
                    style={{ width: `${completionPct}%` }}
                    className={`h-full transition-all ${
                      completionPct === 100
                        ? 'bg-[rgb(81,96,146)]'
                        : completionPct >= 70
                        ? 'bg-[rgb(81,96,146)]'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Info</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Company Name', value: form.name },
                    { label: 'Email', value: form.email || '—' },
                    { label: 'Phone', value: form.phone || '—' },
                    { label: 'Address', value: form.address || '—' },
                    { label: 'City', value: form.city || '—' },
                    { label: 'Country', value: form.country || '—' },
                    { label: 'Created', value: formatDate(form.createdAt) },
                    { label: 'Updated', value: formatDate(form.updatedAt) },
                  ].map((i) => (
                    <div key={i.label}>
                      <label className="text-xs text-gray-500">{i.label} :</label>
                      <p className="text-sm text-gray-900 font-medium">{i.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Main Content ---- */}
            <div className="lg:col-span-2 space-y-5">
              {/* Description */}
              {form.description && (
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">About</h3>
                  <div
                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.description }}
                  />
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 bg-[rgb(81,96,146)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-[rgb(81,96,146)]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Type :</p>
                    <p className="text-sm font-medium text-gray-900">{form.type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 bg-[rgb(81,96,146)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-[rgb(81,96,146)]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Website :</p>
                    <a
                      href="https://www.example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[rgb(81,96,146)] hover:underline"
                    >
                      www.example.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ---------- Documents Tab ---------- */
          <div className="mt-4">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Uploaded Documents</h3>
                <button
                  onClick={() => navigate('/company/dashboard/edit-profile?tab=documents')}
                  className="px-4 py-2 bg-[rgb(81,96,146)] text-white rounded-lg hover:bg-[rgb(71,86,136)] transition-colors text-sm font-medium"
                >
                  Upload New
                </button>
              </div>

              {documents.length ? (
                <div className="space-y-3">
                  {documents.map((doc, i) => (
                    <DocumentItem
                      key={i}
                      label={doc!.label}
                      url={doc!.url}
                      date={doc!.date}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- Edit Form (Overlay) ---------- */}
        {editMode && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Company Profile
              </h2>

              {/* ---------- Form Grid ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Company Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-[rgb(81,96,146)] focus:border-[rgb(81,96,146)]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Company Type *
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInput}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-[rgb(81,96,146)] focus:border-[rgb(81,96,146)]"
                  >
                    {COMPANY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email / Phone */}
                {(['email', 'phone'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'tel'}
                      name={field}
                      value={form[field] ?? ''}
                      onChange={handleInput}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-[rgb(81,96,146)] focus:border-[rgb(81,96,146)]"
                    />
                    {errors[field] && (
                      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
                    )}
                  </div>
                ))}

                {/* Address, City, Country */}
                {(['address', 'city', 'country'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {field} *
                    </label>
                    <input
                      name={field}
                      value={form[field] ?? ''}
                      onChange={handleInput}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-[rgb(81,96,146)] focus:border-[rgb(81,96,146)]"
                    />
                    {errors[field] && (
                      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
                    )}
                  </div>
                ))}

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleInput}
                    className="w-4 h-4 text-[rgb(81,96,146)] rounded focus:ring-[rgb(81,96,146)]"
                  />
                  <label className="ml-2 text-xs text-gray-600">Company is active</label>
                </div>
              </div>

              {/* ---------- Logo ---------- */}
              <div className="mb-6">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Company Logo
                </label>

                <div
                  {...dragProps}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                    dragging
                      ? 'border-[rgb(81,96,146)] bg-[rgb(81,96,146)]/5'
                      : 'border-gray-300 hover:border-[rgb(81,96,146)] hover:bg-[rgb(81,96,146)]/5'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])}
                    className="hidden"
                    id="logo-input"
                  />
                  <label htmlFor="logo-input" className="cursor-pointer">
                    <div
                      className={`p-3 rounded-full w-fit mx-auto transition-colors ${
                        dragging ? 'bg-[rgb(81,96,146)]/20' : 'bg-gray-100 group-hover:bg-[rgb(81,96,146)]/20'
                      }`}
                    >
                      <Upload
                        className={`h-8 w-8 ${
                          dragging ? 'text-[rgb(81,96,146)]' : 'text-gray-400 group-hover:text-[rgb(81,96,146)]'
                        }`}
                      />
                    </div>
                    <p className="mt-3 font-medium text-gray-900 text-sm">
                      {dragging ? 'Drop here' : 'Drop image or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG ≤ 10 MB</p>
                  </label>
                </div>

                {logoPreview && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative group rounded-lg overflow-hidden border">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-20 w-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(logoPreview!)}
                          className="p-1.5 bg-white/90 rounded-full"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={clearLogo}
                          className="p-1.5 bg-white/90 rounded-full"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Current logo</p>
                  </div>
                )}
                {errors.logo && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors.logo}
                  </p>
                )}
              </div>

              {/* ---------- Description ---------- */}
              <div className="mb-6">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </label>
                <div className="border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-[rgb(81,96,146)]">
                  <ReactQuill
                    theme="snow"
                    value={form.description ?? ''}
                    onChange={handleQuill}
                    placeholder="Tell us about your company..."
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        ['clean'],
                      ],
                    }}
                  />
                </div>
              </div>

              {/* ---------- Buttons ---------- */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-2 bg-[rgb(81,96,146)] text-white rounded-lg hover:bg-[rgb(71,86,136)] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileSettings;
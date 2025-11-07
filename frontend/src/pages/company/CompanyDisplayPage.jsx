import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Building2, Store, Utensils, ShoppingCart, Hotel, Wine, Sparkles } from 'lucide-react';
import Header from '../../components/header';
import companyService from '../../services/companyService'; // adjust path if needed
import { API_URL } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const CompanyDisplay = () => {
  // ---- state -------------------------------------------------------
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // ---- fetch companies ---------------------------------------------
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyService.getAllCompanies(); // API call
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ---- filter logic ------------------------------------------------
  const filteredCompanies = companies.filter(company => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.city && company.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || company.type === selectedType;
    return matchesSearch && matchesType && company.isActive;
  });

  // ---- UI helpers --------------------------------------------------
  const companyTypes = [
    { value: 'ALL', label: 'All Companies', icon: Building2 },
    { value: 'RESTAURANT', label: 'Restaurants', icon: Utensils },
    { value: 'SUPERMARKET', label: 'Supermarkets', icon: ShoppingCart },
    { value: 'SHOP', label: 'Shops', icon: Store },
    { value: 'HOTEL', label: 'Hotels', icon: Hotel },
    { value: 'BAR', label: 'Bars', icon: Wine },
    { value: 'LOUNGE', label: 'Lounges', icon: Sparkles },
  ];

  const getTypeIcon = type => {
    const map = {
      RESTAURANT: Utensils,
      SUPERMARKET: ShoppingCart,
      SHOP: Store,
      HOTEL: Hotel,
      BAR: Wine,
      LOUNGE: Sparkles,
      OTHER: Building2,
    };
    return map[type] || Building2;
  };

  const getTypeColor = type => {
    const map = {
      RESTAURANT: 'bg-orange-100 text-orange-700',
      SUPERMARKET: 'bg-red-100 text-red-700',
      SHOP: 'bg-orange-100 text-orange-800',
      HOTEL: 'bg-red-100 text-red-800',
      BAR: 'bg-orange-200 text-orange-900',
      LOUNGE: 'bg-red-200 text-red-900',
      OTHER: 'bg-gray-100 text-gray-700',
    };
    return map[type] || 'bg-gray-100 text-gray-700';
  };

  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading companies…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header path={'Partners'} title={'Our Partners'} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Our Partners
            </h1>
            <p className="text-slate-600">Discover amazing businesses in your area</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies by name, city, or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {companyTypes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSelectedType(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedType === value
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No companies found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="text-slate-600 mb-6">
              Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredCompanies.map(company => {
                const TypeIcon = getTypeIcon(company.type);
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-orange-100"
                  >
                    {/* Logo */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                      {company.logo ? (
                        <img
                          src={`${API_URL}${company.logo}`}
                          alt={company.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-20 h-20 text-orange-400" />
                        </div>
                      )}
                      <div
                        className={`absolute top-4 right-4 ${getTypeColor(
                          company.type
                        )} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md`}
                      >
                        <TypeIcon className="w-4 h-4" />
                        {company.type}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition">
                        {company.name}
                      </h3>
                      

                      {company.description && (
                        <div className="text-slate-600 text-sm  line-clamp-2   my-5  " dangerouslySetInnerHTML={{__html : company.description}} />
                      )}
                

                      <div className="space-y-2">
                        {company.address && (
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                            <span>
                              {company.address}, {company.city}, {company.country}
                            </span>
                          </div>
                        )}

                        {company.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                            <span>{company.phone}</span>
                          </div>
                        )}

                        {company.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4 flex-shrink-0 text-red-500" />
                            <span className="truncate">{company.email}</span>
                          </div>
                        )}
                      </div>

                      <button 
                      onClick={()=> navigate(`/companies/details/${company.id}`)}
                      className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDisplay;
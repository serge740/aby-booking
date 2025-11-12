import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, Clock, Star, Share2, Heart,
  Utensils, ShoppingCart, Store, Hotel, Wine, Sparkles, Building2,
  Calendar, ChevronRight
} from 'lucide-react';
import companyService from '../../services/companyService';
import { API_URL } from '../../api/api';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch company with category and items
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await companyService.getCompanyById(id); // should include categories & items
        setCompany(data);
      } catch (err) {
        setError(err.message || 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
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

  const formatPrice = price => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // -----------------------------------------------------------------
  // Loading / Error
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading company…</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Company not found'}</div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(company.type);

  // -----------------------------------------------------------------
  // Main Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">

      {/* Cover Image */}
      <div className="relative h-96 bg-slate-900">
        <img
          src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop`}
          alt={company.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-red-600" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition">
            <Share2 className="w-5 h-5 text-orange-600" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-900'}`}
            />
          </button>
        </div>

        {/* Company Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className=" mx-auto">
            <div className={`inline-flex items-center gap-2 ${getTypeColor(company.type)} px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-md`}>
              <TypeIcon className="w-4 h-4" />
              {company.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                <span className="font-semibold">{company.rating ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{company.city}, {company.country}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                About
              </h2>
              <div className="pre-editor">

              {company.description && (
                <div
                className="text-slate-800  leading-relaxed ql-editor "
                dangerouslySetInnerHTML={{ __html: company.description }}
                />
              )}
              </div>
            </div>

            {/* Featured Menu Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Featured Menu Items
                </h2>
                <button 
                onClick={()=>navigate(`/partners/menu/${id}`)}
                className="text-red-600 hover:text-red-700 font-medium cursor-pointer flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {(company.items || []).map(item => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-xl transition group cursor-pointer border ${
                      item.isActive ? 'hover:bg-orange-50 border-orange-100' : 'opacity-60 border-gray-200'
                    }`}
                  >
                    {/* Item Image */}
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-100 to-red-100">
                      <img
                        src={item.mainImage ? `${API_URL}${item.mainImage}` : '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 transition">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.description && (
        <div
          className="text-sm text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}
                      <div className="flex items-center gap-3">
                        {item.category && (
                          <span className="text-xs font-medium text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                            {item.category.name}
                          </span>
                        )}
                        {item.isActive ? (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-xl transition shadow-md">
                View Full Menu ({(company.items || []).length}+ items)
              </button>
            </div>

            {/* Menu Categories */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Menu Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(company.category || []).map(cat => (
                  <div
                    key={cat.id}
                    className="relative overflow-hidden rounded-xl border-2 border-orange-100 hover:border-red-500 transition group cursor-pointer"
                  >
                    <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50">
                      {cat.image ? (
                        <img
                          src={`${API_URL}${cat.image}`}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Utensils className="w-12 h-12 text-orange-300" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="text-white font-semibold">{cat.name}</h3>
                      <p className="text-orange-200 text-xs">{cat.items?.length || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6 border border-orange-100">
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                {company.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Address</p>
                      <p className="text-slate-600 text-sm">
                        {company.address}<br />
                        {company.city}, {company.country}
                      </p>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <a href={`tel:${company.phone}`} className="text-red-600 hover:underline text-sm">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                {company.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <a href={`mailto:${company.email}`} className="text-red-600 hover:underline text-sm break-all">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}

                {company.openingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Opening Hours</p>
                      <p className="text-slate-600 text-sm">{company.openingHours}</p>
                    </div>
                  </div>
                )}

                {company.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Member Since</p>
                      <p className="text-slate-600 text-sm">{formatDate(company.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-xl transition shadow-md">
                  Make Reservation
                </button>
                <button className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-3 px-4 rounded-xl transition border border-orange-200">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Business Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Total Menu Items</span>
                  <span className="text-2xl font-bold">{(company.items || []).length}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Categories</span>
                  <span className="text-2xl font-bold">{(company.category || []).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-100">Rating</span>
                  <span className="text-2xl font-bold">{company.rating ?? '—'}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
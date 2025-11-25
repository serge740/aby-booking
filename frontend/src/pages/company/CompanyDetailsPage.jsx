import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Mail, Clock, Star, Share2, Heart,
  Utensils, ShoppingCart, Store, Hotel, Wine, Sparkles, Building2,
  Calendar, ChevronRight, Percent
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

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await companyService.getCompanyById(id);
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
  // Icon & Color Helpers
  // -----------------------------------------------------------------
  const getTypeIcon = (type) => {
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

  const getTypeColor = (type) => {
    const map = {
      RESTAURANT: 'bg-orange-100 text-orange-700',
      SUPERMARKET: 'bg-red-100 text-red-700',
      SHOP: 'bg-yellow-100 text-yellow-800',
      HOTEL: 'bg-purple-100 text-purple-700',
      BAR: 'bg-amber-100 text-amber-800',
      LOUNGE: 'bg-pink-100 text-pink-700',
      OTHER: 'bg-gray-100 text-gray-700',
    };
    return map[type] || 'bg-gray-100 text-gray-700';
  };

  // RWF Formatter (Rwanda Francs)
  const formatRWF = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // -----------------------------------------------------------------
  // Loading / Error States
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-700">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-md">
          <div className="text-6xl mb-4">Warning</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Restaurant Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'We couldn\'t find this place.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(company.type);

  // -----------------------------------------------------------------
  // Main Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Cover */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        <img
          src={company.coverImage ? `${API_URL}${company.coverImage}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop'}
          alt={company.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Back & Action Buttons */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/95 hover:bg-white p-3 rounded-full shadow-xl transition z-10"
        >
          <ArrowLeft className="w-6 h-6 text-orange-600" />
        </button>

        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button className="bg-white/95 hover:bg-white p-3 rounded-full shadow-xl transition">
            <Share2 className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/95 hover:bg-white p-3 rounded-full shadow-xl transition"
          >
            <Heart
              className={`w-6 h-6 transition-all ${isFavorite ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-700'}`}
            />
          </button>
        </div>

        {/* Company Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className=" mx-auto">
            <div className={`inline-flex items-center gap-2 ${getTypeColor(company.type)} px-5 py-2.5 rounded-full text-sm font-bold mb-4 shadow-lg`}>
              <TypeIcon className="w-5 h-5" />
              {company.type || 'Business'}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{company.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>{company.city}, {company.country}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: About + Featured Items */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-orange-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                About Us
              </h2>
              {company.description ? (
                <div
                  className="text-gray-700 leading-relaxed text-lg ql-editor prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              ) : (
                <p className="text-gray-500 italic">No description available.</p>
              )}
            </div>

            {/* Featured Menu Items */}
            {(company.items && company.items.length > 0) && (
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-orange-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Popular Items
                  </h2>
                  <button
                    onClick={() => navigate(`/partners/menu/${id}`)}
                    className="text-orange-600 hover:text-orange-700 font-bold text-lg flex items-center gap-2 transition"
                  >
                    View Full Menu <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {company.items.slice(0, 6).map((item) => {
                    const finalPrice = item.sellingPrice * (1 - (item.discount || 0) / 100);
                    const hasDiscount = item.discount > 0;

                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/partners/menu/${id}/item/${item.id}`)}
                        className="flex gap-5 p-5 rounded-2xl hover:bg-orange-50 transition cursor-pointer border border-gray-100 group"
                      >
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-md">
                          <img
                            src={item.mainImage ? `${API_URL}${item.mainImage}` : '/placeholder-food.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {hasDiscount && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {item.discount}%
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              className="text-gray-600 text-sm mt-1 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                          )}
                          <div className="flex items-end justify-between mt-4">
                            <div>
                              {hasDiscount && (
                                <span className="text-gray-500 line-through text-sm mr-3">
                                  {formatRWF(item.sellingPrice)}
                                </span>
                              )}
                              <span className="text-2xl font-bold text-orange-600">
                                {formatRWF(finalPrice)}
                              </span>
                            </div>
                            {item.isActive ? (
                              <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                                Available
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate(`/partners/menu/${id}`)}
                  className="w-full mt-8 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition shadow-lg text-lg"
                >
                  View All {company.items.length} Items
                </button>
              </div>
            )}
          </div>

          {/* Right: Contact + Stats */}
          <div className="space-y-8">

            {/* Contact Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-6 border border-orange-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Contact & Info
              </h2>
              <div className="space-y-5 text-gray-700">
                {company.address && (
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm">{company.address}<br />{company.city}, {company.country}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href={`tel:${company.phone}`} className="text-orange-600 hover:underline text-sm">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}
                {company.email && (
                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href={`mailto:${company.email}`} className="text-orange-600 hover:underline text-sm break-all">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}
                {company.openingHours && (
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Opening Hours</p>
                      <p className="text-sm">{company.openingHours}</p>
                    </div>
                  </div>
                )}
                {company.createdAt && (
                  <div className="flex gap-4">
                    <Calendar className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Member Since</p>
                      <p className="text-sm">{formatDate(company.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition shadow-lg">
                  Make a Reservation
                </button>
                <button className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-4 rounded-2xl transition border-2 border-orange-300">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">At a Glance</h3>
              <div className="space-y-5 text-lg">
                <div className="flex justify-between">
                  <span className="text-orange-100">Total Items</span>
                  <span className="text-3xl font-bold">{(company.items || []).length}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-100">Customer Rating</span>
                  <span className="text-3xl font-bold">{company.rating?.toFixed(1) || '—'}/5</span>
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
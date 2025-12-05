import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Wine,
  Droplets,
  ArrowLeft,
  Share2,
  TypeIcon,
  MapPin,
  Utensils,
  Store,
  Hotel,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import menuItemService from '../../services/menuItemService';
import { API_URL } from '../../api/api';
import companyService from '../../services/companyService';

const ITEMS_PER_PAGE = 12;

// RWF Currency Formatter
const formatRWF = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RestaurantMenu() {
  const { id: companyId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('EATING'); // EATING or DRINKING
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    if (companyId) fetchMenuItems();

  }, [companyId]);

  const fetchMenuItems = async () => {
    if (!companyId) {
      setError('No restaurant selected');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await menuItemService.getMenuItemsByCompanyId(companyId);
      const companyInfo = await companyService.getCompanyById(companyId);
      const items = Array.isArray(response) ? response : response.data || [];
    

      // Normalize images and ingredients
      const normalizedItems = items.map((item) => {
        let ingredients = [];
        if (item.ingredients) {
          try {
            const parsed =
              typeof item.ingredients === 'string'
                ? JSON.parse(item.ingredients)
                : item.ingredients;
            ingredients = Array.isArray(parsed)
              ? parsed.map((i) => (typeof i === 'string' ? i : i.name || '')).filter(Boolean)
              : [];
          } catch (e) {
            ingredients = [];
          }
        }

        return {
          ...item,
          ingredients,
          mainImage: item.mainImage ? `${API_URL}${item.mainImage}` : null,
        };
      });


      setCompany(companyInfo);

      setMenuItems(normalizedItems);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleCart = (id) => {
    setCart((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemClick = (item) => {
    navigate(`/partners/menu/${companyId}/item/${item.id}`);
  };

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

  // Filter only by purpose (Food / Drinks)
  const filteredItems = menuItems.filter(
    (item) => item.purpose === activeTab && item.isActive !== false
  );

  // Pagination logic
  const { currentItems, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const current = filteredItems.slice(start, end);

    return { currentItems: current, totalPages: total };
  }, [filteredItems, currentPage]);
  

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading delicious items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center px-4">
          <div className="text-orange-600 text-6xl mb-4">Warning</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button
            onClick={fetchMenuItems}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(company?.type);

  return (
    <div className="w-full py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
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
      
      <div className="mx-auto  px-4 md:px-8 py-8 md:py-12  ">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-orange-600 italic text-lg md:text-xl mb-3 font-medium"
          >
            Fresh & Tasty
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
          >
            Our <span className="text-orange-600">Menu</span>
          </motion.h2>
        </motion.div>

        {/* Food / Drinks Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('EATING')}
            className={`px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg ${
              activeTab === 'EATING'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Food
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('DRINKING')}
            className={`px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg ${
              activeTab === 'DRINKING'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Drinks
          </motion.button>
        </div>

        {/* No Items Message */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-8xl mb-6 text-gray-300">{activeTab === 'EATING' ? 'Food' : 'Drink'}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No {activeTab === 'EATING' ? 'food' : 'drinks'} available
            </h3>
            <p className="text-gray-600">Check back later for updates!</p>
          </motion.div>
        ) : (
          <>
            {/* Results Counter */}
            <p className="text-center text-gray-600 mb-8">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
            </p>

            {/* Menu Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + currentPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                {currentItems.map((item, index) => {
                  const isFavorite = favorites.includes(item.id);
                  const inCart = cart.includes(item.id);
                  const hasDiscount = item.discount > 0;
                  const finalPrice = hasDiscount
                    ? item.sellingPrice * (1 - item.discount / 100)
                    : item.sellingPrice;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 60, scale: 0.9 },
                        visible: { opacity: 1, y: 0, scale: 1 },
                      }}
                      whileHover={{ y: -12, scale: 1.03 }}
                      onClick={() => handleItemClick(item)}
                      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 group"
                    >
                      {/* Image Section */}
                      <div className="relative p-8 bg-gradient-to-br from-orange-50 to-amber-50">
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg">
                            -{item.discount}%
                          </div>
                        )}

                        {/* Drink Badge */}
                        {item.purpose === 'DRINKING' && (
                          <div className={`absolute top-4 ${hasDiscount ? 'left-28' : 'left-4'} px-3 py-2 rounded-full text-white text-xs font-bold flex items-center gap-1.5 z-10 ${
                            item.drinkState === 'ALCOHOLIC' ? 'bg-purple-600' : 'bg-teal-600'
                          }`}>
                            {item.drinkState === 'ALCOHOLIC' ? <Wine className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
                            {item.drinkState === 'ALCOHOLIC' ? 'Alcoholic' : 'Non-Alcoholic'}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              isFavorite ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                            }`}
                          >
                            <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCart(item.id);
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              inCart ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'
                            }`}
                          >
                            <ShoppingCart className="w-6 h-6" />
                          </button>
                        </div>

                        {/* Item Image */}
                        <div className="w-48 h-48 mx-auto">
                          {item.mainImage ? (
                            <img
                              src={item.mainImage}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-full shadow-2xl ring-8 ring-white/50"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-6xl">
                              {activeTab === 'EATING' ? 'Food' : 'Drink'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p
                            className="text-gray-600 text-sm line-clamp-2 mb-3"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        )}

                        {/* Ingredients */}
                        {item.purpose === 'EATING' && item.ingredients?.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {item.ingredients.slice(0, 4).map((ing, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                {ing}
                              </span>
                            ))}
                            {item.ingredients.length > 4 && (
                              <span className="text-xs text-gray-500 italic">+{item.ingredients.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-end justify-between mt-4">
                          <div>
                            {hasDiscount && (
                              <p className="text-gray-400 line-through text-sm">
                                {formatRWF(item.sellingPrice)}
                              </p>
                            )}
                            <p className="text-2xl font-bold text-orange-600">
                              {formatRWF(finalPrice)}
                            </p>
                          </div>

                          {item.rating > 0 && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-yellow-700">{item.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        currentPage === page
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-orange-100'
                      } shadow-md`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
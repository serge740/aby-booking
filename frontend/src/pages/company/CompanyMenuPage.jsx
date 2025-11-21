import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Wine, Droplets } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import menuItemService from '../../services/menuItemService';
import { API_URL } from '../../api/api';

const ITEMS_PER_PAGE = 12;

export default function RestaurantMenu() {
  const { id: companyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('EATING');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyId) fetchMenuItems();
  }, [companyId]);

  const fetchMenuItems = async () => {
    if (!companyId) {
      setError('No company selected');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await menuItemService.getMenuItemsByCompanyId(companyId);
      const items = Array.isArray(response) ? response : response.data || [];

      // Normalize ingredients (name only)
      const normalizedItems = items.map(item => {
        let ingredients = [];
        if (item.ingredients) {
          if (typeof item.ingredients === 'string') {
            try {
              const parsed = JSON.parse(item.ingredients);
              ingredients = Array.isArray(parsed)
                ? parsed.map(i => (typeof i === 'string' ? i : i.name || '')).filter(Boolean)
                : [];
            } catch {
              ingredients = [];
            }
          } else if (Array.isArray(item.ingredients)) {
            ingredients = item.ingredients
              .map(i => (typeof i === 'string' ? i : i.name || ''))
              .filter(Boolean);
          }
        }
        return { ...item, ingredients };
      });

      setMenuItems(normalizedItems);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when tab or category changes
  useEffect(() => {
    setCurrentPage(1);
    setActiveCategory('All Items');
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

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemClick = (item) => {
    navigate(`/partners/menu/${companyId}/item/${item.id}`);
  };

  // Filter items by purpose (tab)
  const filteredByPurpose = menuItems.filter(
    (item) => item.purpose === activeTab && item.isActive !== false
  );

  // Get unique categories for current tab
  const categories = ['All Items', ...new Set(filteredByPurpose.map((item) => item.category?.name || 'Uncategorized'))];

  // Filter and paginate
  const { filteredItems, totalPages, currentItems } = useMemo(() => {
    const filtered =
      activeCategory === 'All Items'
        ? filteredByPurpose
        : filteredByPurpose.filter((item) => item.category?.name === activeCategory);

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const current = filtered.slice(start, end);

    return { filteredItems: filtered, totalPages: total, currentItems: current };
  }, [activeTab, activeCategory, currentPage, filteredByPurpose]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center px-4">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Menu</h2>
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <button
            onClick={fetchMenuItems}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-10 px-4 md:px-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center mb-12 gap-6"
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-red-600 italic text-base md:text-lg mb-2 font-medium"
            >
              Our Menu
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              Delicious <span className="text-red-600">Selections</span>
            </motion.h2>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-4 mb-4">
            <motion.button
              onClick={() => setActiveTab('EATING')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-sm ${
                activeTab === 'EATING'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Food
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('DRINKING')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-sm ${
                activeTab === 'DRINKING'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Drinks
            </motion.button>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5 + idx * 0.05,
                  type: 'spring',
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* No Items Message */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Available</h3>
            <p className="text-gray-600">
              No {activeTab === 'EATING' ? 'food' : 'drink'} items available in this category.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results Counter */}
            <motion.p
              key={`${activeCategory}-${currentPage}-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 text-gray-600 text-sm"
            >
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of{' '}
              {filteredItems.length} items
            </motion.p>

            {/* Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${activeCategory}-${activeTab}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                  exit: { opacity: 0 },
                }}
              >
                {currentItems.map((item, index) => {
                  const isFavorite = favorites.includes(item.id);
                  const inCart = cart.includes(item.id);
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + index;
                  const hasDiscount = item.discount > 0;
                  const finalPrice = hasDiscount
                    ? (item.sellingPrice * (1 - item.discount / 100)).toFixed(2)
                    : item.sellingPrice.toFixed(2);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 80, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.6,
                            delay:
                              Math.floor(globalIdx / 4) * 0.3 +
                              (globalIdx % 4) * 0.08,
                            ease: 'easeOut',
                            type: 'spring',
                            stiffness: 100,
                          },
                        },
                        exit: {
                          opacity: 0,
                          scale: 0.8,
                          y: -50,
                          transition: { duration: 0.3 },
                        },
                      }}
                      whileHover={{ y: -8 }}
                      onClick={() => handleItemClick(item)}
                      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative border border-gray-100 cursor-pointer"
                    >
                      {/* Image Area */}
                      <div className="relative p-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 overflow-hidden">
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: 0.5 + globalIdx * 0.02,
                              type: 'spring',
                              stiffness: 200,
                            }}
                            className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-lg"
                          >
                            {item.discount}% OFF
                          </motion.div>
                        )}

                        {/* Drink Type Badge */}
                        {item.purpose === 'DRINKING' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + globalIdx * 0.02 }}
                            className={`absolute top-4 ${hasDiscount ? 'left-28' : 'left-4'} ${
                              item.drinkState === 'ALCOHOLIC'
                                ? 'bg-purple-600'
                                : 'bg-green-600'
                            } text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1`}
                          >
                            {item.drinkState === 'ALCOHOLIC' ? (
                              <Wine className="w-3 h-3" />
                            ) : (
                              <Droplets className="w-3 h-3" />
                            )}
                            {item.drinkState === 'ALCOHOLIC'
                              ? item.alcoholicType || 'Alcoholic'
                              : 'Non-Alcoholic'}
                          </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + globalIdx * 0.02 }}
                          className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.4 }}
                            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              isFavorite
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-red-50'
                            }`}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={isFavorite ? 'currentColor' : 'none'}
                              strokeWidth={isFavorite ? 0 : 2}
                            />
                          </motion.button>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCart(item.id);
                            }}
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              inCart
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </motion.button>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                          className="relative w-44 h-44 mx-auto"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-xl"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.6, 0.8, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                          {item.mainImage ? (
                            <img
                              src={`${API_URL}${item.mainImage}`}
                              alt={item.name}
                              className="relative w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shadow-xl ring-4 ring-white flex items-center justify-center">
                              <span className="text-4xl">🍽️</span>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + globalIdx * 0.02 }}
                        className="p-6"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                          {item.name}
                        </h3>

                        {item.description && (
                          <div
                            className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        )}

                        {/* Ingredients for food */}
                        {item.purpose === 'EATING' && item.ingredients?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.slice(0, 3).map((ing, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                >
                                  {ing}
                                </span>
                              ))}
                              {item.ingredients.length > 3 && (
                                <span className="text-xs text-gray-500 italic">
                                  +{item.ingredients.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            {hasDiscount && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-400 text-sm line-through"
                              >
                                ${item.sellingPrice.toFixed(2)}
                              </motion.span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-gray-700 font-semibold text-sm">
                                Price:
                              </span>
                              <motion.span
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="text-red-600 font-bold text-2xl"
                              >
                                ${finalPrice}
                              </motion.span>
                            </div>
                          </div>

                          {item.rating && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                delay: 0.8,
                              }}
                              className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full"
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-yellow-700 font-bold text-sm">
                                {item.rating}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-3 mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-full transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-red-50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: currentPage === page ? 1.2 : 1,
                        backgroundColor:
                          currentPage === page ? '#dc2626' : '#ffffff',
                        color: currentPage === page ? '#ffffff' : '#374151',
                      }}
                      className="w-10 h-10 rounded-full font-semibold text-sm shadow-sm transition-all"
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-full transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-red-50'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
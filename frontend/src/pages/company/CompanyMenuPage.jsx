import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, Grid, List, ShoppingCart, Star, Plus, Minus, X,
  ChevronLeft, ChevronRight, Heart, ArrowLeft,
  Share2,
  MapPin,
  Utensils,
  Store,
  Hotel,
  Wine,
  Sparkles,
  Building2
} from 'lucide-react';
import menuItemService from '../../services/menuItemService';
import { API_URL } from '../../api/api';

const Header = ({ path, title }) => (
  <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-6 shadow-lg">
    <div className="flex items-center gap-2 text-sm mb-1">
      <span className="opacity-80">{path}</span>
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
);

const CompanyMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // -----------------------------------------------------------------
  // Fetch menu items by company ID
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuItemService.getMenuItemsByCompanyId(id);

        // API returns an array of menu items with nested company & category
        if (!Array.isArray(data) || data.length === 0) {
          setError('No menu items found');
          return;
        }

        const firstItem = data[0];
        setCompany(firstItem.company);
        setMenuItems(data);

        // Extract unique categories
        const uniqueCats = Array.from(new Map(
          data
            .filter(item => item.category)
            .map(item => [item.category.id, item.category])
        ).values());

        setCategories(uniqueCats);
      } catch (err) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMenu();
  }, [id]);

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch && item.isActive;
  });

  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Other';
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleFavorite = (itemId) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setImageIndex(0);
  };

  const nextImage = () => {
    if (selectedItem?.otherImages?.length > 0) {
      setImageIndex(prev => (prev + 1) % selectedItem.otherImages.length);
    }
  };

  const prevImage = () => {
    if (selectedItem?.otherImages?.length > 0) {
      setImageIndex(prev =>
        prev === 0 ? selectedItem.otherImages.length - 1 : prev - 1
      );
    }
  };

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
  // Loading / Error
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading menu…</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Menu not available'}</div>
      </div>
    );
  }

   const TypeIcon = getTypeIcon(company.type);
  // -----------------------------------------------------------------
  // Main Render
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="relative h-96 bg-slate-900">
            <img
              src={`${API_URL}${company.logo}`}
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

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200 sticky top-0 z-40">
        <div className="lg:px-16 mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="lg:hidden p-2 hover:bg-orange-50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-red-600" />
              </button>
              <img
                src={`${API_URL}${company.logo}`}
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover border-2 border-orange-200"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {company.name}
                </h1>
                <p className="text-sm text-slate-600">Menu</p>
              </div>
            </div>

            <button className="relative bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-orange-200 sticky top-[140px] z-30">
        <div className="xl:p-16 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              All Items ({menuItems.filter(i => i.isActive).length})
            </button>
            {categories.map(category => {
              const itemCount = menuItems.filter(item => item.categoryId === category.id && item.isActive).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {category.name} ({itemCount})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="xl:p-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </p>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-orange-100"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                      <img
                        src={`${API_URL}${item.mainImage}`}
                        alt={item.name}
                        onClick={() => openItemModal(item)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                      </button>
                      {item.otherImages && item.otherImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                          +{item.otherImages.length - 1} photos
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition line-clamp-1">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white p-2 rounded-lg transition shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2">
                        <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer border border-orange-100"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                        <img
                          src={`${API_URL}${item.mainImage}`}
                          alt={item.name}
                          onClick={() => openItemModal(item)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.otherImages && item.otherImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                            +{item.otherImages.length - 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-red-600 transition">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                {getCategoryName(item.categoryId)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className="p-2 hover:bg-orange-50 rounded-lg transition"
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                          </button>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <div className="relative h-96 bg-gradient-to-br from-orange-100 to-red-100">
                <img
                  src={selectedItem.otherImages?.[imageIndex] ? `${API_URL}${selectedItem.otherImages[imageIndex]}` : `${API_URL}${selectedItem.mainImage}`}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                {selectedItem.otherImages && selectedItem.otherImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedItem.otherImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImageIndex(idx)}
                          className={`h-2 rounded-full transition ${idx === imageIndex ? 'bg-gradient-to-r from-red-600 to-orange-500 w-6' : 'bg-white/50 w-2'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedItem.name}</h2>
                    <span className="text-xs text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                      {getCategoryName(selectedItem.categoryId)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">{selectedItem.description}</p>

                <div className="flex items-center justify-between pt-6 border-t border-orange-200">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Price</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {formatPrice(selectedItem.price)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleFavorite(selectedItem.id)}
                      className="p-3 border-2 border-orange-200 hover:border-red-500 rounded-lg transition"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(selectedItem.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </button>
                    <button
                      onClick={() => {
                        addToCart(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-medium shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-4 max-w-sm z-40 border-2 border-orange-200">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
            Cart Summary
            <span className="text-sm font-normal text-slate-500">{cartItemCount} items</span>
          </h3>
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item.name} × {item.quantity}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{formatPrice(cartTotal)}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-lg transition shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyMenuPage;
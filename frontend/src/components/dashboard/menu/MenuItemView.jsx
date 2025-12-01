// src/pages/MenuItemView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import menuItemService from '../../../services/menuItemService';
import { API_URL } from '../../../api/api';


const formatRWF = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MenuItemView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await menuItemService.getOneMenuItem(id);

      let otherImages = [];
      if (Array.isArray(data.otherImages)) {
        otherImages = data.otherImages
          .filter(url => url)
          .map(url => `${API_URL}${url}`);
      }

      // Handle ingredients: support string or object
      let ingredients = [];
      if (data.ingredients) {
        if (!Array.isArray(data.ingredients)) {
          try {
            data.ingredients = JSON.parse(data.ingredients);
          } catch {
            data.ingredients = [];
          }
        }
        // Extract name only — handle both string and {name, quantity} formats
        ingredients = data.ingredients.map(ing => 
          typeof ing === 'string' ? ing : (ing.name || '')
        ).filter(Boolean);
      }

      const filterData = {
        ...data,
        mainImage: data.mainImage ? `${API_URL}${data.mainImage}` : null,
        otherImages,
        ingredients // now array of strings only
      };

      setItem(filterData);
    } catch (err) {
      setError('Failed to load menu item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The menu item could not be loaded.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const allImages = [item.mainImage, ...(Array.isArray(item.otherImages) ? item.otherImages : [])].filter(Boolean);
  const hasImages = allImages.length > 0;

  // Calculate discounted price
  const discountedPrice = item.discount > 0
    ? (item.sellingPrice * (1 - item.discount / 100)).toFixed(2)
    : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Menu</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg aspect-square">
              {hasImages ? (
                <img
                  src={allImages[currentImageIndex]}
                  alt={item.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Discount Badge */}
              {item.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                  {item.discount}% OFF
                </div>
              )}

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasImages && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden aspect-square transition-all ${
                      currentImageIndex === index ? 'ring-4 ring-orange-500' : 'ring-2 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category & Purpose Badges */}
            <div className="flex gap-3 flex-wrap">
              {item.category && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {item.category.name}
                </span>
              )}
              {item.purpose && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {item.purpose}
                </span>
              )}
            </div>

            {/* Title and Status */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.name}</h1>
              <div className="flex items-center gap-2">
                {item.isActive ? (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Available
                  </span>
                ) : (
                  <span className="flex items-center text-red-c600 text-sm font-medium">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-4xl font-bold text-gray-900">{formatRWF(discountedPrice)}</span>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatRWF(item.sellingPrice.toFixed(2))}
                  </span>
                  <span className="text-green-600 font-semibold">
                    Save {formatRWF(item.sellingPrice - parseFloat(discountedPrice)).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  {formatRWF(item.sellingPrice.toFixed(2))}
                </span>
              )}
            </div>

            {/* Purpose-Specific Details */}
            {item.purpose === 'DRINKING' && (
              <div className="bg-primary-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Drink Type:</span>
                  <span className="capitalize">{item.drinkState?.toLowerCase()}</span>
                </div>
                {item.drinkState === 'ALCOHOLIC' && item.alcoholicType && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Alcohol:</span>
                    <span className="capitalize">{item.alcoholicType.toLowerCase()}</span>
                  </div>
                )}
                {item.difference !== null && item.difference !== undefined && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Profit Margin:</span>
                    <span>{formatRWF(item.difference.toFixed(2))}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients - NAME ONLY */}
            {item.purpose === 'EATING' && item.ingredients?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      • {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recipe (Uncomment if needed) */}
            {/* {item.purpose === 'EATING' && item.recipe && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.recipe}</p>
              </div>
            )} */}

            {/* Description */}
            {item.description && (
              <div className="border-t border-b border-gray-200 py-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div
                  className="text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            )}

            {/* Company Info */}
            {item.company && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">SERVED BY</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={`${API_URL}${item.company.logo}` || '/placeholder-company.png'}
                    alt={item.company.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{item.company.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.8 (250+ reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                className={`flex-1 font-semibold py-4 rounded-xl transition-colors ${
                  item.isActive
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => navigate(`/company/dashboard/menu-item/update/${id}`)}
                disabled={!item.isActive}
              >
                Edit Menu Item
              </button>
              <button className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Meta Info */}
            <div className="text-sm text-gray-500 pt-4 space-y-1">
              <p>
                Last updated: {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && hasImages && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 transition"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 p-2 transition"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img
            src={allImages[currentImageIndex]}
            alt={item.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 p-2 transition"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
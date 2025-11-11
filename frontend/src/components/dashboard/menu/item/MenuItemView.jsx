import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Sample data matching your MenuItem model
const sampleMenuItem = {
  id: "clx123abc",
  name: "Grilled Salmon with Herbs",
  description: "Fresh Atlantic salmon grilled to perfection, served with a medley of seasonal vegetables, lemon butter sauce, and roasted baby potatoes. Garnished with fresh herbs and a touch of olive oil.",
  price: 24.99,
  mainImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
  otherImages: [
    "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
  ],
  isActive: true,
  discount: 15,
  category: {
    id: "cat123",
    name: "Main Courses"
  },
  company: {
    id: "comp123",
    name: "The Gourmet Kitchen",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80"
  },
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-11-01T14:20:00Z"
};

export default function MenuItemView() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const allImages = [sampleMenuItem.mainImage, ...sampleMenuItem.otherImages];
  
  const discountedPrice = sampleMenuItem.discount > 0 
    ? (sampleMenuItem.price * (1 - sampleMenuItem.discount / 100)).toFixed(2)
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
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Menu</span>
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart 
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
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
              <img
                src={allImages[currentImageIndex]}
                alt={sampleMenuItem.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openLightbox(currentImageIndex)}
              />
              
              {/* Discount Badge */}
              {sampleMenuItem.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                  {sampleMenuItem.discount}% OFF
                </div>
              )}

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden aspect-square ${
                    currentImageIndex === index ? 'ring-4 ring-orange-500' : 'ring-2 ring-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category Badge */}
            {sampleMenuItem.category && (
              <div className="inline-block">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {sampleMenuItem.category.name}
                </span>
              </div>
            )}

            {/* Title and Status */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {sampleMenuItem.name}
              </h1>
              <div className="flex items-center gap-2">
                {sampleMenuItem.isActive ? (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Available
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 text-sm font-medium">
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
                  <span className="text-4xl font-bold text-gray-900">
                    ${discountedPrice}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ${sampleMenuItem.price.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold">
                    Save ${(sampleMenuItem.price - parseFloat(discountedPrice)).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  ${sampleMenuItem.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {sampleMenuItem.description}
              </p>
            </div>

            {/* Restaurant Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">SERVED BY</h3>
              <div className="flex items-center gap-4">
                <img
                  src={sampleMenuItem.company.logo}
                  alt={sampleMenuItem.company.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {sampleMenuItem.company.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8 (250+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
                disabled={!sampleMenuItem.isActive}
              >
                {sampleMenuItem.isActive ? 'Add to Order' : 'Currently Unavailable'}
              </button>
              <button className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Meta Info */}
            <div className="text-sm text-gray-500 pt-4 space-y-1">
              <p>Item ID: {sampleMenuItem.id}</p>
              <p>Last updated: {new Date(sampleMenuItem.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <img
            src={allImages[currentImageIndex]}
            alt={sampleMenuItem.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
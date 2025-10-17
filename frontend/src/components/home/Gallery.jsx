import React, { useState } from 'react';
import { X, Coffee, Camera } from 'lucide-react';
import Header from "../../components/header";


function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample coffee shop images with varying heights for masonry effect
  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt: 'Coffee cups and beans', height: 'h-64' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80', alt: 'Espresso machine', height: 'h-80' },
    { id: 3, url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80', alt: 'Coffee shop interior', height: 'h-72' },
    { id: 4, url: 'https://images.unsplash.com/photo-1559496417-e7f25c8d6ef9?w=800&q=80', alt: 'Latte art', height: 'h-96' },
    { id: 5, url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', alt: 'Coffee shop ambiance', height: 'h-64' },
    { id: 6, url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80', alt: 'Brewing coffee', height: 'h-80' },
    { id: 7, url: 'https://images.unsplash.com/photo-1501492693654-5e1e4b9b7441?w=800&q=80', alt: 'Cappuccino', height: 'h-72' },
    { id: 8, url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80', alt: 'Coffee and pastries', height: 'h-64' },
    { id: 9, url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80', alt: 'Cozy corner', height: 'h-96' },
    { id: 10, url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80', alt: 'Coffee preparation', height: 'h-80' },
    { id: 11, url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', alt: 'Coffee beans', height: 'h-72' },
    { id: 12, url: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&q=80', alt: 'Outdoor seating', height: 'h-64' }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
       {/* Header Section */}
      <Header title={' Our Gallery'} path={' our gallery'} />


      {/* Gallery Grid */}
      <main className="max-w-8xl mx-auto px-6 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-amber-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-10 h-10" />
          </button>
          <img
            src={selectedImage.url}
            alt={selectedImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-0 right-0 text-center text-white text-lg">
            {selectedImage.alt}
          </p>
        </div>
      )}

    
    </div>
  );
}

export default Gallery;
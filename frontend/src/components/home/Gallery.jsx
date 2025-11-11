import React, { useState } from 'react';
import { X, Coffee, Camera } from 'lucide-react';
import Header from "../../components/header";


function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample coffee shop images with varying heights for masonry effect
const images = [
  { id: 1, url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074', alt: 'Modern restaurant interior', height: 'h-64' },
  { id: 2, url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80', alt: 'Table setup with wine glasses', height: 'h-80' },
  { id: 3, url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80', alt: 'Fine dining setup', height: 'h-72' },
  { id: 4, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', alt: 'Restaurant with customers dining', height: 'h-96' },
  { id: 5, url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80', alt: 'Outdoor restaurant ambiance', height: 'h-64' },
  { id: 6, url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80', alt: 'Chef preparing meal', height: 'h-80' },
  { id: 7, url: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80', alt: 'Restaurant bar area', height: 'h-72' },
  { id: 8, url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80', alt: 'Modern open kitchen', height: 'h-64' },
  { id: 9, url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&auto=format&fit=crop&q=80', alt: 'Cozy restaurant corner', height: 'h-96' },
  { id: 10, url: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=80', alt: 'Food being served in restaurant', height: 'h-80' },
  { id: 11, url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', alt: 'Busy restaurant evening', height: 'h-72' },
  { id: 12, url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop&q=80', alt: 'Restaurant terrace', height: 'h-64' }
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
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
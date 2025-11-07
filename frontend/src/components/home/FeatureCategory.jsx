import React from 'react';
import Image1 from '../../assets/feature/image1.avif'
import Image2 from '../../assets/feature/image2.avif'
import Image3 from '../../assets/feature/image3.webp'
import Image4 from '../../assets/feature/image1.avif'
import Image5 from '../../assets/feature/image5.webp'
import Image6 from '../../assets/feature/image6.webp'
import Image7 from '../../assets/feature/image8.webp'
// import Image8 from '../../assets/feature/image1.avif'



const categories= [
  {
    id: 1,
    title: 'Dairy, Bread & Eggs',
    imageUrl: Image1,
  },
  {
    id: 2,
    title: 'Snack & Munchies',
    imageUrl: Image2,
  },
  {
    id: 3,
    title: 'Bakery & Biscuits',
    imageUrl: Image3,
  },
  {
    id: 4,
    title: 'Instant Food',
    imageUrl:Image4,
  },
  {
    id: 5,
    title: 'Tea, Coffee & Drinks',
    imageUrl: Image6,
  },
  {
    id: 6,
    title: 'Atta, Rice & Dal',
    imageUrl: Image7,
  },
];

function FeatureCategory() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Categories</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col items-center cursor-pointer"
            >
              <div className="w-24 h-40">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-center text-gray-700 font-medium line-clamp-2">
                {category.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureCategory;
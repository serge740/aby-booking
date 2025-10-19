import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AbyPopularDishes() {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = ['All Items', 'Pizza', 'Burger', 'Chicken', 'Pasta', 'Drinks', 'Desserts'];

  const dishes = [
    // Pizzas
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, basil and tomato sauce.',
      price: 15.00,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800'
    },
    {
      id: 2,
      name: 'Vegetable Supreme',
      description: 'Loaded with fresh vegetables, olives and premium cheese.',
      price: 14.50,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 3,
      name: 'Pepperoni Deluxe',
      description: 'Double pepperoni with extra cheese and Italian herbs.',
      price: 16.00,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
      rating: 5
    },
    {
      id: 4,
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken with BBQ sauce and caramelized onions.',
      price: 17.50,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 20.00
    },
    
    // Burgers
    {
      id: 5,
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce.',
      price: 12.00,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5
    },
    {
      id: 6,
      name: 'Cheese Explosion',
      description: 'Triple cheese burger with crispy bacon and onion rings.',
      price: 14.50,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 7,
      name: 'Mushroom Swiss',
      description: 'Sautéed mushrooms with Swiss cheese and garlic aioli.',
      price: 13.50,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600'
    },
    {
      id: 8,
      name: 'Spicy Jalapeño',
      description: 'Beef patty with jalapeños, pepper jack and chipotle mayo.',
      price: 13.00,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 16.00
    },
    
    // Chicken
    {
      id: 9,
      name: 'Crispy Wings',
      description: 'Golden fried wings with choice of sauce and ranch dip.',
      price: 11.00,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5
    },
    {
      id: 10,
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken breast with herbs and vegetables.',
      price: 15.50,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 11,
      name: 'Chicken Tenders',
      description: 'Crispy breaded chicken tenders with honey mustard.',
      price: 10.50,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 12,
      name: 'Buffalo Chicken',
      description: 'Spicy buffalo chicken with blue cheese and celery.',
      price: 12.50,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600'
    },
    
    // Pasta
    {
      id: 13,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon, parmesan and black pepper.',
      price: 13.00,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800'
    },
    {
      id: 14,
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato sauce with garlic, chili and herbs.',
      price: 11.50,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
      badge: null,
      rating: 5
    },
    {
      id: 15,
      name: 'Fettuccine Alfredo',
      description: 'Rich and creamy alfredo sauce with parmesan.',
      price: 12.50,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 16,
      name: 'Seafood Linguine',
      description: 'Fresh seafood with garlic white wine sauce.',
      price: 18.00,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600'
    },
    
    // Drinks
    {
      id: 17,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, no added sugar.',
      price: 5.00,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 18,
      name: 'Tropical Smoothie',
      description: 'Mango, pineapple and passion fruit blend.',
      price: 6.50,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5
    },
    {
      id: 19,
      name: 'Iced Coffee',
      description: 'Cold brew coffee with ice and cream.',
      price: 4.50,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 20,
      name: 'Berry Blast',
      description: 'Mixed berries smoothie with yogurt.',
      price: 6.00,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600'
    },
    
    // Desserts
    {
      id: 21,
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with ganache.',
      price: 7.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5
    },
    {
      id: 22,
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake with berry compote.',
      price: 8.00,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=400&fit=crop',
      badge: null
    },
    {
      id: 23,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone.',
      price: 8.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600'
    },
    {
      id: 24,
      name: 'Ice Cream Sundae',
      description: 'Three scoops with chocolate sauce and whipped cream.',
      price: 6.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 8.00
    },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredDishes = activeCategory === 'All Items' 
    ? dishes 
    : dishes.filter(dish => dish.category === activeCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDishes = filteredDishes.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
  };

  return (
    <div className="w-full py-16 md:py-24 px-4 md:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          {/* Title */}
          <div>
            <p className="text-red-600 italic text-base md:text-lg mb-2 font-medium">
              Food Items
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Popular <span className="text-red-600">Dishes</span>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-gray-600 text-sm">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredDishes.length)} of {filteredDishes.length} items
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentDishes.map((dish) => {
            const isFavorite = favorites.includes(dish.id);
            
            return (
              <div
                key={dish.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative p-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
                  {/* Badge */}
                  {dish.badge && (
                    <div className={`absolute top-4 left-4 ${dish.badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-lg`}>
                      {dish.badge}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => toggleFavorite(dish.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                        isFavorite 
                          ? 'bg-red-600 text-white scale-110' 
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:scale-110'
                      }`}
                    >
                      <Heart 
                        className="w-5 h-5" 
                        fill={isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all duration-300 shadow-lg">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Dish Image */}
                  <div className="relative w-44 h-44 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="relative w-full h-full object-cover rounded-full transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl ring-4 ring-white"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                    {dish.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {dish.oldPrice && (
                        <span className="text-gray-400 text-sm line-through">
                          ${dish.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-gray-700 font-semibold text-sm">
                          Price:
                        </span>
                        <span className="text-red-600 font-bold text-2xl">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {dish.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900 text-sm">{dish.rating} star</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-red-100/50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-sm'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-sm'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
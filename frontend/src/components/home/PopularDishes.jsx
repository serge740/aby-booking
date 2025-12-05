import React, { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AbyPopularDishes() {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    'All Items',
    'Pizza',
    'Burger',
    'Chicken',
    'Pasta',
    'Drinks',
    'Desserts',
  ];

  const dishes = [
    // ── Pizzas ─────────────────────────────
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, basil and tomato sauce.',
      price: 15.0,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
    },
    {
      id: 2,
      name: 'Vegetable Supreme',
      description: 'Loaded with fresh vegetables, olives and premium cheese.',
      price: 14.5,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Pepperoni Deluxe',
      description: 'Double pepperoni with extra cheese and Italian herbs.',
      price: 16.0,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
      rating: 5,
    },
    {
      id: 4,
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken with BBQ sauce and caramelized onions.',
      price: 17.5,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 20.0,
    },

    // ── Burgers ───────────────────────────
    {
      id: 5,
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce.',
      price: 12.0,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5,
    },
    {
      id: 6,
      name: 'Cheese Explosion',
      description: 'Triple cheese burger with crispy bacon and onion rings.',
      price: 14.5,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
    },
    {
      id: 7,
      name: 'Mushroom Swiss',
      description: 'Sautéed mushrooms with Swiss cheese and garlic aioli.',
      price: 13.5,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
    },
    {
      id: 8,
      name: 'Spicy Jalapeño',
      description: 'Beef patty with jalapeños, pepper jack and chipotle mayo.',
      price: 13.0,
      category: 'Burger',
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 16.0,
    },

    // ── Chicken ───────────────────────────
    {
      id: 9,
      name: 'Crispy Wings',
      description: 'Golden fried wings with choice of sauce and ranch dip.',
      price: 11.0,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5,
    },
    {
      id: 10,
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken breast with herbs and vegetables.',
      price: 15.5,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop',
    },
    {
      id: 11,
      name: 'Chicken Tenders',
      description: 'Crispy breaded chicken tenders with honey mustard.',
      price: 10.5,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop',
    },
    {
      id: 12,
      name: 'Buffalo Chicken',
      description: 'Spicy buffalo chicken with primary cheese and celery.',
      price: 12.5,
      category: 'Chicken',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
    },

    // ── Pasta ───────────────────────────
    {
      id: 13,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon, parmesan and black pepper.',
      price: 13.0,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
    },
    {
      id: 14,
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato sauce with garlic, chili and herbs.',
      price: 11.5,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
      rating: 5,
    },
    {
      id: 15,
      name: 'Fettuccine Alfredo',
      description: 'Rich and creamy alfredo sauce with parmesan.',
      price: 12.5,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=400&fit=crop',
    },
    {
      id: 16,
      name: 'Seafood Linguine',
      description: 'Fresh seafood with garlic white wine sauce.',
      price: 18.0,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
    },

    // ── Drinks ───────────────────────────
    {
      id: 17,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, no added sugar.',
      price: 5.0,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    },
    {
      id: 18,
      name: 'Tropical Smoothie',
      description: 'Mango, pineapple and passion fruit blend.',
      price: 6.5,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5,
    },
    {
      id: 19,
      name: 'Iced Coffee',
      description: 'Cold brew coffee with ice and cream.',
      price: 4.5,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop',
    },
    {
      id: 20,
      name: 'Berry Blast',
      description: 'Mixed berries smoothie with yogurt.',
      price: 6.0,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
    },

    // ── Desserts ───────────────────────────
    {
      id: 21,
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with ganache.',
      price: 7.5,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      badge: 'HOT',
      badgeColor: 'bg-gray-800',
      rating: 5,
    },
    {
      id: 22,
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake with berry compote.',
      price: 8.0,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=400&fit=crop',
    },
    {
      id: 23,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone.',
      price: 8.5,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
      badge: 'NEW',
      badgeColor: 'bg-red-600',
    },
    {
      id: 24,
      name: 'Ice Cream Sundae',
      description: 'Three scoops with chocolate sauce and whipped cream.',
      price: 6.5,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      badge: 'SALE',
      badgeColor: 'bg-orange-600',
      oldPrice: 8.0,
    },
  ];

  // ── Handlers ───────────────────────────
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

  // ── Filtering & Pagination ───────────────────────────
  const { filteredDishes, totalPages, currentDishes } = useMemo(() => {
    const filtered =
      activeCategory === 'All Items'
        ? dishes
        : dishes.filter((d) => d.category === activeCategory);

    const total = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const current = filtered.slice(start, end);

    return { filteredDishes: filtered, totalPages: total, currentDishes: current };
  }, [activeCategory, currentPage]);

  return (
    <div className="w-full py-8 md:py-10 px-4 md:px-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="mx-auto max-w-8xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-red-600 italic text-base md:text-lg mb-2 font-medium"
            >
              Food Items
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              Popular <span className="text-red-600">Dishes</span>
            </motion.h2>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4 + idx * 0.05,
                  type: 'spring',
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Filter by ${cat}`}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Counter */}
        <motion.p
          key={`${activeCategory}-${currentPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-gray-600 text-sm"
        >
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredDishes.length)} of{' '}
          {filteredDishes.length} items
        </motion.p>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${activeCategory}`}
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
            {currentDishes.map((dish, index) => {
              const isFavorite = favorites.includes(dish.id);
              const inCart = cart.includes(dish.id);
              const globalIdx = (currentPage - 1) * itemsPerPage + index;

              return (
                <motion.div
                  key={dish.id}
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
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative border border-gray-100"
                >
                  {/* Image Area */}
                  <div className="relative p-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 overflow-hidden">
                    {/* Badge */}
                    {dish.badge && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.5 + globalIdx * 0.02,
                          type: 'spring',
                          stiffness: 200,
                        }}
                        className={`absolute top-4 left-4 ${dish.badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-lg`}
                      >
                        {dish.badge}
                      </motion.div>
                    )}

                    {/* Action Buttons (hover) */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + globalIdx * 0.02 }}
                      className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {/* Favorite */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dish.id);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          scale: isFavorite ? [1, 1.3, 1] : 1,
                        }}
                        transition={{ duration: 0.4 }}
                        aria-label={
                          isFavorite ? 'Remove from favorites' : 'Add to favorites'
                        }
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

                      {/* Cart */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCart(dish.id);
                        }}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
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
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="relative w-full h-full object-cover rounded-full shadow-xl ring-4 ring-white"
                      />
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
                      {dish.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {dish.oldPrice && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gray-400 text-sm line-through"
                          >
                            ${dish.oldPrice.toFixed(2)}
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
                            ${dish.price.toFixed(2)}
                          </motion.span>
                        </div>
                      </div>

                      {dish.rating && (
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
                            {dish.rating}
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

        {/* ── Pagination ── */}
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
              aria-label="Previous page"
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
                  aria-label={`Page ${page}`}
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
              aria-label="Next page"
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
      </div>
    </div>
  );
}
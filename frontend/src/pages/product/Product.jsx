import React, { useState } from 'react';
import { ShoppingCart, X, ChevronRight, Filter as FilterIcon } from 'lucide-react';
import Header from '../../components/header';

const CoffeeShopPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'American Black Coffee', price: 14.00, quantity: 1, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80' }
  ]);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [sortBy, setSortBy] = useState('default');

  const products = [
    {
      id: 1,
      name: 'Accessory',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 4.66
    },
    {
      id: 2,
      name: 'American Black Coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 14.00
    },
    {
      id: 3,
      name: 'Coffee Canephora',
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 23.05
    },
    {
      id: 4,
      name: 'Coffee bean',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 18.50
    },
    {
      id: 5,
      name: 'Coffee candy',
      image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 8.99
    },
    {
      id: 6,
      name: 'Ephiopian Aroma',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&q=80',
      description: 'Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit.',
      price: 26.00
    }
  ];

  const categories = [
    { name: 'Coffee', count: 12 },
    { name: 'Green coffee', count: 8 },
    { name: 'Italian', count: 15 },
    { name: 'Roasted coffee', count: 10 },
    { name: 'Uncategorized', count: 5 }
  ];

  const tags = ['#accessory', '#arabica', '#bean', '#candy', '#cup', '#ethiopien', '#latte'];

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, image: product.image }]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
         <Header title="product" path="product" />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white shadow-lg p-6 min-h-screen">
          {/* Cart Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-200">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs" style={{ color: '#c0aa83' }}>
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Subtotal:</span>
                <span className="font-bold" style={{ color: '#c0aa83' }}>${subtotal.toFixed(2)}</span>
              </div>
              
              <button className="w-full py-3 bg-gray-900 text-white font-semibold mb-3 hover:bg-gray-800 transition-colors">
                View cart
              </button>
              
              <button 
                className="w-full py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#c0aa83' }}
              >
                CHECKOUT
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer hover:pl-2 transition-all group">
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-700" style={{ color: '#c0aa83' }} />
                    <span className="text-gray-700 group-hover:text-gray-900">{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by Price */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by price</h3>
            <div className="mb-4">
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ 
                  background: `linear-gradient(to right, #c0aa83 0%, #c0aa83 ${(priceRange[1]/30)*100}%, #e5e7eb ${(priceRange[1]/30)*100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Price: <span className="font-semibold">${priceRange[0]} — ${priceRange[1]}</span>
            </div>
            <button 
              className="px-6 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Filter
            </button>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                >
                  {tag}
                  {index < tags.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">Showing all 9 results</p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="default">Default sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#c0aa83' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-6 py-2 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                      style={{ backgroundColor: '#c0aa83' }}
                    >
                      <ShoppingCart size={18} />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeShopPage;
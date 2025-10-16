import React, { useState, useContext } from 'react';
import { ShoppingCart, X, ChevronRight, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path as needed
import Header from '../../components/header';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../../stores/productDatat';




const CoffeeShopPage = () => {
  const { cart, addToCart: addToCartGlobal, removeFromCart } = useCart();
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [products] = useState(productsData);
  const navigate = useNavigate();


  // Updated products array with new structure



  // Extract unique categories and tags for filtering
  const allCategories = [...new Set(products.flatMap(p => p.categories))];
  const allTags = [...new Set(products.flatMap(p => p.tags))];

  const categories = allCategories.map(cat => ({
    name: cat,
    count: products.filter(p => p.categories.includes(cat)).length
  }));

  const tags = allTags;

  // Filter products based on criteria
  const filteredProducts = products.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategories = selectedCategories.length === 0 || 
      selectedCategories.some(cat => product.categories.includes(cat));
    const inTags = selectedTags.length === 0 || 
      selectedTags.some(tag => product.tags.includes(tag));
    
    return inPriceRange && inCategories && inTags;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Calculate subtotal from global cart
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Wrapper for addToCart to ensure product has all necessary properties
  const addToCart = (product) => {
    const productToAdd = {
      ...product,
      price: product.price,
      image: product.image,
      // Ensure we don't add gallery, fullDescription, etc. to cart for storage efficiency
      gallery: undefined,
      fullDescription: undefined,
      reviews: undefined,
      originalPrice: product.originalPrice,
      onSale: product.onSale,
      rating: product.rating,
      stock: product.stock,
      categories: product.categories,
      tags: product.tags
    };
    
    addToCartGlobal(productToAdd, 1);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="product" path="product" />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white shadow-lg p-6 min-h-screen overflow-y-auto">
          {/* Cart Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
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

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900">Subtotal:</span>
                  <span className="font-bold" style={{ color: '#c0aa83' }}>${subtotal.toFixed(2)}</span>
                </div>
                
                <button 
                onClick={()=>navigate('/cart')}
                className="w-full py-3 bg-gray-900 text-white font-semibold mb-3 hover:bg-gray-800 transition-colors">
                  View cart
                </button>
                
                <button 
                  className="w-full py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#c0aa83' }}
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer">
                  <div 
                    className="flex items-center gap-2 hover:pl-2 transition-all"
                    onClick={() => handleCategoryToggle(category.name)}
                  >
                    <ChevronRight size={16} className="text-gray-400" style={{ color: '#c0aa83' }} />
                    <span className={`text-gray-700 ${selectedCategories.includes(category.name) ? 'font-semibold text-gray-900' : ''}`}>
                      {category.name} ({category.count})
                    </span>
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
                max={Math.max(...products.map(p => p.price))}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ 
                  background: `linear-gradient(to right, #c0aa83 0%, #c0aa83 ${(priceRange[1]/Math.max(...products.map(p => p.price)))*100}%, #e5e7eb ${(priceRange[1]/Math.max(...products.map(p => p.price)))*100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Price: <span className="font-semibold">${priceRange[0]} — ${priceRange[1].toFixed(2)}</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-500 hover:text-gray-700 bg-gray-100'
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing {sortedProducts.length} of {products.length} results
              {selectedCategories.length > 0 && ` in: ${selectedCategories.join(', ')}`}
              {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
            </p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="default">Default sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map(product => {
              const isInCart = cart.some(item => item.id === product.id);
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        Sale
                      </div>
                    )}
                    {product.stock < 5 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        Low Stock
                      </div>
                    )}
                    {isInCart && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        In Cart
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16}
                          className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                        />
                      ))}
                      <span className="text-sm text-gray-600">({product.rating})</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 cursor-pointer" onClick={()=> navigate(`/products/${product.id}`) }>{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {product.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold" style={{ color: '#c0aa83' }}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.onSale && product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.stock} in stock
                      </span>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isInCart ? 'bg-primary-500' : 'bg-primary-500'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {isInCart ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to cart'}
                    </button>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {product.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="bg-gray-100 px-1 py-0.5 rounded">#{cat}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 px-1 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeShopPage;
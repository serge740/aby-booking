import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { productsData } from '../../stores/productDatat';

// Mock Header component
const Header = ({ path, title }) => (
  <div className="bg-gray-900 text-white p-6">
    <div className="max-w-7xl mx-auto">
      <p className="text-sm text-gray-400 mb-2">{path}</p>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  </div>
);

const CoffeeShop = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigate = useNavigate();
  const { id: blogId } = useParams();
  const id = Number(blogId);

  // Product data using the new structure
  const product = productsData.find(p => p.id === id);

  // Combine image and gallery into unified images array
  // Ensure image comes first, then gallery images (filter out duplicates)
  const allImages = [
    product.image, // Main image always first
    ...product.gallery.filter(img => img !== product.image) // Add gallery images, excluding main image to avoid duplicates
  ].filter(Boolean); // Remove any null/undefined images

  // Check if product is in cart and get cart quantity
  const cartItem = cart.find(item => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const isInCart = cartQuantity > 0;
  const totalAvailableStock = product.stock - cartQuantity;

  // Sync quantity with cart when cart changes
  useEffect(() => {
    if (isInCart) {
      setQuantity(cartQuantity);
    } else {
      setQuantity(1);
    }
  }, [cartQuantity, isInCart]);

  // Initialize activeImageIndex to ensure it's within bounds
  useEffect(() => {
    if (activeImageIndex >= allImages.length) {
      setActiveImageIndex(0);
    }
  }, [allImages.length, activeImageIndex]);

  // Updated related products with new structure
  const relatedProducts = productsData.filter(p => 
    p.id !== product.id && 
    p.categories.some(cat => product.categories.includes(cat))
  ).slice(0, 3);

  const categories = [...new Set(product.categories.concat(
    relatedProducts.flatMap(p => p.categories)
  ))];

  const tags = [...new Set(product.tags.concat(
    relatedProducts.flatMap(p => p.tags)
  ))];

  // Calculate subtotal from global cart
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Enhanced quantity handlers
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= product.stock) {
      if (isInCart) {
        updateQuantity(product.id, newQuantity);
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  const decrementQuantity = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= 1) {
      if (isInCart) {
        updateQuantity(product.id, newQuantity);
      } else {
        setQuantity(newQuantity);
      }
    } else if (newQuantity === 0 && isInCart) {
      removeFromCart(product.id);
      setQuantity(1);
    }
  };

  const handleQuantityInputChange = (e) => {
    const newQuantity = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
    setQuantity(newQuantity);
    
    if (isInCart) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isInCart && quantity <= product.stock) {
      const productToAdd = {
        ...product,
        quantity: quantity,
        price: product.price,
        image: product.image // Keep original image for cart display
      };
      addToCart(productToAdd, quantity);
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setQuantity(1);
  };

  const handleCartQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  // Updated gallery navigation using allImages
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <Header path={'Product'} title={`Single Product - ${product.name}`} />

      <div className="flex">
        {/* Sidebar - unchanged */}
        <aside className="w-72 bg-white shadow-lg p-6 flex-shrink-0">
          {/* Cart Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cart</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-200">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition mt-1"
                  >
                    <X size={18} />
                  </button>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleCartQuantityChange(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleCartQuantityChange(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100"
                        disabled={item.stock && item.quantity >= item.stock}
                      >
                        +
                      </button>
                      <p className="text-sm ml-2" style={{ color: '#6F4E37' }}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Subtotal:</span>
                    <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                onClick={()=>navigate('/cart')}
                className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition mb-3">
                  View cart
                </button>
                <button 
                  className="w-full py-3 rounded-md font-semibold text-white hover:opacity-90 transition"
                  style={{ backgroundColor: '#6F4E37' }}
                >
                  CHECKOUT
                </button>
              </>
            )}
          </div>

          {/* Categories and Tags sections unchanged */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category}>
                  <button className="text-gray-700 hover:text-gray-900 transition flex items-center text-sm">
                    <span className="mr-2 text-gray-400">›</span>
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Product Detail Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12 mb-12">
              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                {/* Updated Product Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image with Slider */}
                  <div className="relative group">
                    <img 
                      src={allImages[activeImageIndex]}
                      alt={`${product.name} - Image ${activeImageIndex + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    {product.onSale && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                        Sale
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft size={24} className="text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight size={24} className="text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* Updated Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  </div>

                  {/* Updated Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-3">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`aspect-square rounded-lg overflow-hidden transition ${
                          activeImageIndex === index 
                            ? 'ring-4 ring-primary-500 shadow-lg' 
                            : 'ring-2 ring-gray-200 hover:ring-gray-400'
                        }`}
                      >
                        <img 
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info - unchanged */}
                <div className="flex flex-col justify-center">
                  {/* ... rest of product info remains the same ... */}
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}>
                        ★
                      </div>
                    ))}
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold" style={{ color: '#6F4E37' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.onSale && product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through ml-4">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {product.stock} in stock
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-8">
                    {product.shortDescription}
                  </p>

                  {/* Quantity Selector & Add to Cart - unchanged */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center border-2 border-gray-200 rounded-md overflow-hidden">
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={handleQuantityInputChange}
                        className="w-16 text-center py-3 text-lg font-semibold focus:outline-none bg-white"
                        min="1"
                        max={product.stock}
                      />
                      <div className="flex flex-col border-l-2 border-gray-200">
                        <button 
                          onClick={incrementQuantity}
                          className="px-3 py-1 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={quantity >= product.stock}
                          title="Increase quantity"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button 
                          onClick={decrementQuantity}
                          className="px-3 py-1 hover:bg-gray-100 transition border-t-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={quantity <= 1 && !isInCart}
                          title="Decrease quantity"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      disabled={isInCart || product.stock === 0}
                      className={`flex-1 py-3 px-6 rounded-md text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isInCart ? 'bg-green-600' : 'bg-primary-500'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {isInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
                    </button>
                  </div>

                  {isInCart && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Quantity in cart: <span className="font-bold">{cartQuantity}</span>
                          </p>
                          <p className="text-xs text-blue-600">
                            {totalAvailableStock > 0 ? `${totalAvailableStock} more available` : 'Out of stock'}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveFromCart}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                          Remove from cart
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-100 pt-6 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Categories: </span>
                      <span style={{ color: '#6F4E37' }}>{product.categories.join(', ')}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tags: </span>
                      <span style={{ color: '#6F4E37' }}>{product.tags.join(', ')}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Section - unchanged */}
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="flex gap-2 mb-8">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-3 font-semibold transition ${
                      activeTab === 'description' 
                      ? 'border-b-4 border-gray-900 text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-3 font-semibold rounded-md text-white transition ${
                      activeTab === 'reviews' ? 'opacity-100' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: '#6F4E37' }}
                  >
                    Reviews ({product.reviews.length})
                  </button>
                </div>

                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                    <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                      {product.fullDescription}
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {product.reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                      product.reviews.map((review, index) => (
                        <div key={index} className="border-t border-gray-200 pt-4">
                          <p>{review.text}</p>
                          <p className="text-sm text-gray-500 mt-1">- {review.author}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Related Products Section - unchanged */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map(relatedProduct => {
                  const relatedIsInCart = cart.some(item => item.id === relatedProduct.id);
                  return (
                    <div 
                      key={relatedProduct.id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition overflow-hidden group relative cursor-pointer"
                    >
                      {relatedProduct.onSale && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded z-10">
                          SALE!
                        </div>
                      )}
                      {relatedProduct.stock < 5 && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                          Low Stock
                        </div>
                      )}
                      {relatedIsInCart && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                          In Cart
                        </div>
                      )}
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2" onClick={()=> navigate(`/products/${relatedProduct.id}`)}>{relatedProduct.name}</h3>
                        <div className="mb-2">
                          {relatedProduct.originalPrice && (
                            <span className="text-gray-400 line-through mr-2 text-sm">
                              ${relatedProduct.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xl font-bold" style={{ color: '#6F4E37' }}>
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {relatedProduct.shortDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {relatedProduct.stock} in stock
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(relatedProduct, 1);
                            }}
                            disabled={relatedProduct.stock === 0}
                            className={`px-4 py-2 text-white text-sm font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                              relatedIsInCart ? 'bg-green-500' : 'bg-primary-500'
                            }`}
                          >
                            {relatedIsInCart ? 'In Cart' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoffeeShop;
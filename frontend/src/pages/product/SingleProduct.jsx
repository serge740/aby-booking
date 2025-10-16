import React, { useState } from 'react';
import { ShoppingCart, X, ChevronUp, ChevronDown } from 'lucide-react';
import Header from '../../components/header';

const CoffeeShop = () => {


  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([
    { 
      id: 1, 
      name: 'American Black Coffee', 
      price: 14.00, 
      quantity: 2, 
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop'
    },
    { 
      id: 2, 
      name: 'Coffee Canaphora', 
      price: 23.05, 
      quantity: 1, 
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop'
    }
  ]);

  const relatedProducts = [
    {
      id: 3,
      name: 'Ground coffee',
      price: 13.44,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop'
    },
    {
      id: 4,
      name: 'Coffee bean',
      price: 24.66,
      image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=600&fit=crop'
    },
    {
      id: 5,
      name: 'MyCoffeeShop Cup',
      price: 19.00,
      originalPrice: 23.00,
      sale: true,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop'
    }
  ];

  const categories = [
    'Coffee',
    'Green coffee',
    'Italian',
    'Roasted coffee',
    'Uncategorized'
  ];

  const tags = ['#accessory', '#arabica', '#bean', '#candy', '#cup', '#ethiopian', '#latte'];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header path={'Product'} title={`Single Product - ${''} `}  />

      <div className="flex">

      {/* Sidebar */}

       <aside className="w-72 bg-white shadow-lg p-6 flex-shrink-0">
        {/* Cart Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cart</h2>
          
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-start gap-3">
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
                  <p className="text-sm" style={{ color: '#c0aa83' }}>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Subtotal:</span>
              <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition mb-3">
            View cart
          </button>
          <button 
            className="w-full py-3 rounded-md font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: '#c0aa83' }}
          >
            CHECKOUT
          </button>
        </div>

        {/* Categories Section */}
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

        {/* Tags Section */}
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
              {/* Product Image */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop"
                  alt="Green Africana Coffee"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Green Africana</h1>
                <p className="text-3xl font-bold mb-6" style={{ color: '#c0aa83' }}>
                  $9.00
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Duis et aliquam orci. Vivamus augue quam, sollicitudin quis bibendum quis, eleifend vitae velit
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border-2 border-gray-200 rounded-md overflow-hidden">
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-3 text-lg font-semibold focus:outline-none"
                      min="1"
                    />
                    <div className="flex flex-col border-l-2 border-gray-200">
                      <button 
                        onClick={incrementQuantity}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={decrementQuantity}
                        className="px-3 py-1 hover:bg-gray-100 transition border-t-2 border-gray-200"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="flex-1 py-3 px-6 rounded-md text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#c0aa83' }}
                  >
                    Add to cart
                  </button>
                </div>

                {/* Meta Info */}
                <div className="border-t-2 border-gray-100 pt-6 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Categories: </span>
                    <span style={{ color: '#c0aa83' }}>Coffee, Green coffee</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Tag: </span>
                    <span style={{ color: '#c0aa83' }}>arabica</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
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
                  style={{ backgroundColor: '#c0aa83' }}
                >
                  Reviews (0)
                </button>
              </div>

              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Praesent gravida hendrerit ex, nec eleifend sem convallis vitae.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Morbi sollicitudin arcu ut egestas varius. Nulla neque nisl, blandit a magna at, faucibus hendrerit magna. Ut imperdiet nibh nulla, a vehicula risus luctus vitae. Vestibulum vel ligula et elit scelerisque dictum. In vel pretium lectus, id dignissim nunc. Donec ac faucibus quam. Nullam in magna cursus, mattis ipsum vitae, consectetur tortor. Maecenas aliquam ultrices erat vitrum placerat. Mauris euismod faucibus lectus Aenean elit nibh, efficitur in luctus et, fermentum in enim. Quisque consequat, ex ut faucibus mattis, dui ex interdum ex, sit amet rutrum odio lorem sed tortor.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition overflow-hidden group relative"
                >
                  {product.sale && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded z-10">
                      SALE!
                    </div>
                  )}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{product.name}</h3>
                    <div className="mb-4">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through mr-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xl font-bold" style={{ color: '#c0aa83' }}>
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
                    </div>
  );
};

export default CoffeeShop;
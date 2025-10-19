import React from 'react';

export default function AbyRestaurantMenu() {
  const appetizers = [
    {
      name: "Crispy Wings",
      description: "Spicy buffalo wings served with ranch dip",
      price: "12.50",
    },
    {
      name: "Mozzarella Sticks",
      description: "Golden fried cheese sticks with marinara",
      price: "10.00",
      oldPrice: "14.50",
    },
    {
      name: "Garlic Bread",
      description: "Toasted bread with herb butter",
      price: "8.00",
      recommended: true,
    },
    {
      name: "Loaded Nachos",
      description: "Tortilla chips with cheese, jalapeños and salsa",
      price: "13.50",
    },
    {
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      price: "9.00",
    },
  ];

  const mainCourse = [
    {
      name: "Garlic Burger",
      description: "Juicy beef patty with special garlic sauce",
      price: "15.00",
      oldPrice: "18.50",
    },
    {
      name: "Spicy Chicken Pizza",
      description: "Loaded with chicken, mushrooms and cheese",
      price: "16.90",
      recommended: true,
    },
    {
      name: "BBQ Ribs",
      description: "Tender ribs glazed with BBQ sauce",
      price: "22.50",
    },
    {
      name: "Grilled Salmon",
      description: "Fresh salmon with lemon butter sauce",
      price: "24.00",
    },
    {
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon and parmesan",
      price: "14.25",
    },
  ];

  return (
    <div id='our-menu' className="w-full min-h-screen bg-black">
      {/* Menu Section */}
      <div className="relative bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)`,
          }}
        />

        {/* Dark Overlay - makes image darker but still visible */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />

        {/* Menu Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16">
          {/* Appetizers Section */}
          <div className="bg-opacity-40 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <div className="text-sm italic text-orange-400 mb-2 tracking-wider">Delicious Menu</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Appetizers</h2>

            {/* Menu Items */}
            <div className="space-y-8">
              {appetizers.map((item, index) => (
                <MenuItem
                  key={index}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  recommended={item.recommended}
                />
              ))}
            </div>
          </div>

          {/* Main Course Section */}
          <div className="bg-opacity-40 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <div className="text-sm italic text-orange-400 mb-2 tracking-wider">Favourite Menu</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Main Course</h2>

            {/* Menu Items */}
            <div className="space-y-8">
              {mainCourse.map((item, index) => (
                <MenuItem
                  key={index}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  recommended={item.recommended}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View Full Menu Button */}
        <div className="relative z-10 text-center pb-16">
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            View Full Menu
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ name, description, price, oldPrice, recommended }) {
  return (
    <div className="border-b border-gray-700 pb-6 hover:border-orange-500/50 transition-colors duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-semibold">{name}</h3>
          {recommended && (
            <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Recommend
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {oldPrice && (
            <span className="text-gray-500 line-through text-sm">${oldPrice}</span>
          )}
          <span className="text-orange-400 font-semibold text-lg">${price}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
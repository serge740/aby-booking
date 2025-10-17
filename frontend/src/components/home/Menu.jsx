import React from 'react';
import Header from '../header';

export default function Menu() {
  const breakfastItems = [
    {
      name: "Pancakes",
      description: "Fresh brewed coffee and steamed milk",
      price: "12.50",
    },
    {
      name: "Toasted Waffle",
      description: "Brewed coffee and steamed milk",
      price: "12.00",
      oldPrice: "16.50",
    },
    {
      name: "Fried Chips",
      description: "Rich Milk and Foam",
      price: "15.0",
      recommended: true,
    },
    {
      name: "Pancakes",
      description: "Fresh brewed coffee and steamed milk",
      price: "12.50",
    },
    {
      name: "Banana Cakes",
      description: "Rich Milk and Foam",
      price: "18.0",
    },
  ];

  const coffeeItems = [
    {
      name: "Latte",
      description: "Fresh brewed coffee and steamed milk",
      price: "7.50",
      oldPrice: "12.50",
    },
    {
      name: "White Coffee",
      description: "Brewed coffee and steamed milk",
      price: "5.90",
      recommended: true,
    },
    {
      name: "Chocolate Milk",
      description: "Rich Milk and Foam",
      price: "5.50",
    },
    {
      name: "Greentea",
      description: "Fresh brewed coffee and steamed milk",
      price: "7.50",
    },
    {
      name: "Dark Chocolate",
      description: "Rich Milk and Foam",
      price: "7.25",
    },
  ];

  return (
    <div id='our-menu' className="w-full min-h-screen bg-black">
      {/* Header Section */}
      {/* <Header title={'our menu'} path={'menu'} /> */}
      {/* Menu Section */}
      <div className="relative bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80)`,
          }}
        />

        {/* Dark Overlay - makes image darker but still visible */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />

        {/* Menu Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16">
          {/* Breakfast Section */}
          <div className=" bg-opacity-40 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} >
            <div className="text-sm italic text-gray-300 mb-2">Delicious Menu</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Breakfast</h2>

            {/* Menu Items */}
            <div className="space-y-8">
              {breakfastItems.map((item, index) => (
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

          {/* Coffee Section */}
          <div className=" bg-opacity-40 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} >
            <div className="text-sm italic text-gray-300 mb-2">Favourite Menu</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Coffee</h2>

            {/* Menu Items */}
            <div className="space-y-8">
              {coffeeItems.map((item, index) => (
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
      </div>
    </div>
  );
}

function MenuItem({ name, description, price, oldPrice, recommended }) {
  return (
    <div className="border-b border-gray-700 pb-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold">{name}</h3>
          {recommended && (
            <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full">
              Recommend
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {oldPrice && (
            <span className="text-gray-500 line-through">${oldPrice}</span>
          )}
          <span className="text-orange-400 font-semibold text-lg">${price}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
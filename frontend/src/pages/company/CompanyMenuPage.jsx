// src/components/DynamicRestaurantMenu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import menuItemService from '../../services/menuItemService';

const ITEMS_PER_PAGE = 6;               // <-- change if you want more/less per page

export default function DynamicRestaurantMenu() {
  const { id: companyId } = useParams();
  const [activeTab, setActiveTab] = useState('EATING');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state – one per category
  const [pageByCategory, setPageByCategory] = useState({});

  useEffect(() => {
    if (companyId) fetchMenuItems();
  }, [companyId]);

  const fetchMenuItems = async () => {
    if (!companyId) {
      setError('No company selected');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await menuItemService.getMenuItemsByCompanyId(companyId);
      const items = Array.isArray(response) ? response : response.data || [];

      // ---- normalise ingredients (name only) ----
      const normalizedItems = items.map(item => {
        let ingredients = [];
        if (item.ingredients) {
          if (typeof item.ingredients === 'string') {
            try {
              const parsed = JSON.parse(item.ingredients);
              ingredients = Array.isArray(parsed)
                ? parsed.map(i => (typeof i === 'string' ? i : i.name || '')).filter(Boolean)
                : [];
            } catch {
              ingredients = [];
            }
          } else if (Array.isArray(item.ingredients)) {
            ingredients = item.ingredients
              .map(i => (typeof i === 'string' ? i : i.name || ''))
              .filter(Boolean);
          }
        }
        return { ...item, ingredients };
      });

      setMenuItems(normalizedItems);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---- filter & group ----
  const filteredItems = menuItems.filter(
    item => item.purpose === activeTab && item.isActive !== false
  );

  const groupedByCategory = filteredItems.reduce((acc, item) => {
    const cat = item.category?.name || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedByCategory);

  // ---- pagination helpers ----
  const goToPage = (cat, page) => {
    setPageByCategory(prev => ({ ...prev, [cat]: page }));
  };

  const getCurrentPage = cat => pageByCategory[cat] ?? 1;

  const getPaginatedItems = (items, cat) => {
    const page = getCurrentPage(cat);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return items.slice(start, end);
  };

  const getTotalPages = items => Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div id="our-menu" className="w-full min-h-screen flex justify-center bg-black">
      <div className="relative bg-black text-white w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 min-h-screen w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)`,
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }} />

        {/* Content */}
        <div className="relative z-10 px-8 py-16 md:px-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-sm italic text-orange-400 mb-2 tracking-wider">
              Our Menu
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Delicious Selections
            </h1>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('EATING')}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'EATING'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white bg-opacity-10 text-orange-600 hover:bg-opacity-20'
                }`}
              >
                Food
              </button>
              <button
                onClick={() => setActiveTab('DRINKING')}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'DRINKING'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white bg-opacity-10 text-orange-600 hover:bg-opacity-20'
                }`}
              >
                Drinks
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
              <p className="mt-4 text-gray-400">Loading menu...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={fetchMenuItems}
                className="mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Menu */}
          {!loading && !error && (
            <>
              {categories.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">
                    No {activeTab === 'EATING' ? 'food' : 'drink'} items available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {categories.map(cat => {
                    const items = groupedByCategory[cat];
                    const totalPages = getTotalPages(items);
                    const currentPage = getCurrentPage(cat);
                    const paginated = getPaginatedItems(items, cat);

                    return (
                      <div
                        key={cat}
                        className="bg-opacity-40 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                      >
                        <div className="text-sm italic text-orange-400 mb-2 tracking-wider">
                          {activeTab === 'EATING' ? 'Delicious Menu' : 'Refreshing Drinks'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-12">{cat}</h2>

                        {/* Items */}
                        <div className="space-y-8">
                          {paginated.map(item => (
                            <MenuItem key={item.id} item={item} />
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="mt-10 flex items-center justify-between">
                            <button
                              onClick={() => goToPage(cat, currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`px-4 py-2 rounded-full transition-colors ${
                                currentPage === 1
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-orange-600 hover:bg-orange-500 text-white'
                              }`}
                            >
                              Prev
                            </button>

                            <div className="flex gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                  key={p}
                                  onClick={() => goToPage(cat, p)}
                                  className={`w-8 h-8 rounded-full text-sm transition-colors ${
                                    p === currentPage
                                      ? 'bg-orange-600 text-white'
                                      : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => goToPage(cat, currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`px-4 py-2 rounded-full transition-colors ${
                                currentPage === totalPages
                                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-orange-600 hover:bg-orange-500 text-white'
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                           MENU ITEM CARD                           */
/* ------------------------------------------------------------------ */
function MenuItem({ item }) {
  const hasDiscount = item.discount > 0;
  const finalPrice = hasDiscount
    ? (item.sellingPrice * (1 - item.discount / 100)).toFixed(2)
    : item.sellingPrice.toFixed(2);
    const navigate  = useNavigate()

  return (
    <div  
    onClick={()=> navigate(`/partners/menu/${item.companyId}/item/${item.id}`)}
    className="border-b border-gray-700 pb-6 hover:border-orange-500/50 transition-colors duration-300 " >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-semibold">{item.name}</h3>

          {/* Drink badges */}
          {item.purpose === 'DRINKING' && item.drinkState === 'ALCOHOLIC' && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {item.alcoholicType || 'Alcoholic'}
            </span>
          )}
          {item.purpose === 'DRINKING' && item.drinkState === 'NON_ALCOHOLIC' && (
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Non-Alcoholic
            </span>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {item.discount}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasDiscount && (
            <span className="text-gray-500 line-through text-sm">
              ${item.sellingPrice.toFixed(2)}
            </span>
          )}
          <span className="text-orange-400 font-semibold text-lg">
            ${finalPrice}
          </span>
        </div>
      </div>

      {/* Description (supports HTML from Quill) */}
      {item.description && (
        <div
          className="text-sm text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}

    {/* Ingredients - NAME ONLY (max 5) */}
      {item.purpose === 'EATING' && item.ingredients?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 ">
          <p className='gray-neutral-200'>ingredients: </p>{'  '}
          {item.ingredients.slice(0, 5).map((ingredient, idx) => (
            <span
              key={idx}
              className="text-xs  bg-opacity-10 text-neutral-300  py-1 rounded"
            >
              {ingredient} ,
            </span>
          ))}
          {item.ingredients.length > 5 && (
            <span className="text-xs text-gray-500 italic">
              +{item.ingredients.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
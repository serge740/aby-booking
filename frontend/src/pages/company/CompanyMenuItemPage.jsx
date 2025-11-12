import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wine,
  Beer,
  Martini,
  Utensils,
  ChefHat,
  Tag,
  Percent,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import menuItemService from '../../services/menuItemService';
import { API_URL } from '../../api/api';
import { useCart } from '../../context/CartContext';

const MenuItemDetail = () => {
  const { companyId, itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [menuItem, setMenuItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------------------------------
     1. FETCH MENU ITEM + RELATED
   ------------------------------------------------- */
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const itemData = await menuItemService.getOneMenuItem(itemId);

        // Normalize images
        if (itemData.mainImage) {
          itemData.mainImage = `${API_URL}${itemData.mainImage}`;
        }
        if (itemData.otherImages) {
          let other = itemData.otherImages;
          if (!Array.isArray(other)) other = JSON.parse(other);
          itemData.otherImages = other.map((u) => `${API_URL}${u}`);
        }
        if (itemData.ingredients) {
          let ing = itemData.ingredients;
          if (!Array.isArray(ing)) ing = JSON.parse(ing);
          itemData.ingredients = ing;
        }

        setMenuItem(itemData);
        setSelectedImage(itemData.mainImage || '');

        // Related items
        const all = await menuItemService.getMenuItemsByCompanyId(companyId);
        const related = all
          .filter(
            (i) =>
              i.id !== itemId &&
              i.categoryId === itemData.categoryId &&
              i.isActive
          )
          .map((i) => {
            if (i.mainImage) i.mainImage = `${API_URL}${i.mainImage}`;
            return i;
          })
          .slice(0, 4);

        setRelatedItems(related);
      } catch (err) {
        setError(err.message || 'Failed to load menu item');
      } finally {
        setLoading(false);
      }
    };

    if (itemId && companyId) fetchMenuItem();
  }, [itemId, companyId]);

  /* -------------------------------------------------
     2. ON MOUNT: Check if item is in cart → sync quantity
   ------------------------------------------------- */
  useEffect(() => {
    if (!menuItem || cartItems.length === 0) return;

    const existing = cartItems.find(
      (item) => item.menuItemId === menuItem.id
    );

    if (existing && existing.quantity > 0) {
      setQuantity(existing.quantity);
    } else {
      setQuantity(1);
    }
  }, [menuItem, cartItems]);

  /* -------------------------------------------------
     3. ICON HELPERS
   ------------------------------------------------- */
  const getDrinkIcon = (type) => {
    switch (type) {
      case 'WINE':
        return <Wine className="w-5 h-5" />;
      case 'BEER':
        return <Beer className="w-5 h-5" />;
      case 'LIQUOR':
        return <Martini className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  /* -------------------------------------------------
     4. LOADING / ERROR STATES
   ------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading menu item...</p>
        </div>
      </div>
    );
  }

  if (error || !menuItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-red-200 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Item Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'The requested menu item could not be found.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------
     5. PRICE CALCULATION
   ------------------------------------------------- */
  const finalPrice =
    menuItem.sellingPrice -
    menuItem.sellingPrice * (menuItem.discount / 100);
  const totalPrice = finalPrice * quantity;

  /* -------------------------------------------------
     6. ADD / UPDATE CART
   ------------------------------------------------- */
  const handleAddToCart = () => {
    if (!menuItem.isActive) return;

    const payload = {
      ...menuItem,
      menuItemId: menuItem.id,  // ensure ID
      quantity,
      unitPrice: finalPrice,
      totalPrice,
      companyId,
    };

    // If already in cart → update quantity
    const existing = cartItems.find((i) => i.menuItemId === menuItem.id);
    if (existing) {
      updateQuantity(menuItem.id, quantity);
    } else {
      addToCart(payload);
    }
  };

  /* -------------------------------------------------
     7. RENDER – Your original design (100% unchanged)
   ------------------------------------------------- */
  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="mx-auto p-6 menuItem">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-orange-600"
          >
            Menu
          </button>{' '}
          / <span>{menuItem.category?.name || 'Category'}</span> /{' '}
          <span className="text-gray-900 font-medium">{menuItem.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8">
          {/* LEFT – RELATED */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 border-b pb-2">
                You May Also Like
              </h3>
              <div className="space-y-5">
                {relatedItems.length > 0 ? (
                  relatedItems.map((item) => {
                    const itemFinal =
                      item.sellingPrice -
                      item.sellingPrice * (item.discount / 100);
                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          navigate(
                            `/partners/menu/${companyId}/item/${item.id}`
                          )
                        }
                        className="group flex items-start gap-4 border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.mainImage || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {item.discount > 0 && (
                            <div className="absolute top-1.5 right-1.5 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1.5 line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-600 text-sm">
                              ${itemFinal.toFixed(2)}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ${item.sellingPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No similar items found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE – IMAGES */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={selectedImage || '/placeholder.jpg'}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
              {menuItem.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  {menuItem.discount}% OFF
                </div>
              )}
              {!menuItem.isActive && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {menuItem.mainImage && (
                <button
                  onClick={() => setSelectedImage(menuItem.mainImage)}
                  className={`aspect-square h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === menuItem.mainImage
                      ? 'border-orange-500'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={menuItem.mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </button>
              )}
              {(menuItem.otherImages || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === img
                      ? 'border-orange-500'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT – DETAILS */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                {menuItem.purpose === 'EATING' ? (
                  <Utensils className="w-4 h-4" />
                ) : (
                  getDrinkIcon(menuItem.alcoholicType)
                )}
                <span className="font-medium">
                  {menuItem.category?.name || 'Uncategorized'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {menuItem.name}
              </h1>
              <div className="pre-container">
                {menuItem.description && (
                  <div
                    className="text-sm text-gray-400 ql-editor leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: menuItem.description }}
                  />
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
                {menuItem.discount > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    ${menuItem.sellingPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {menuItem.discount > 0 && (
                <p className="text-green-600 font-medium">
                  You save ${(menuItem.sellingPrice - finalPrice).toFixed(2)}
                </p>
              )}
            </div>

            {menuItem.purpose === 'DRINKING' && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wine className="w-5 h-5 text-orange-500" />
                  Drink Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-2">
                      {menuItem.drinkState === 'ALCOHOLIC' ? (
                        <>
                          {getDrinkIcon(menuItem.alcoholicType)}
                          Alcoholic - {menuItem.alcoholicType}
                        </>
                      ) : (
                        'Non-Alcoholic'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {menuItem.purpose === 'EATING' && (
              <>
                {menuItem.ingredients && menuItem.ingredients.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-orange-500" />
                      Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {menuItem.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {menuItem.recipe && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-orange-500" />
                      Preparation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {menuItem.recipe}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* QUANTITY + ADD TO CART */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-gray-600">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={userId => handleAddToCart()}
                disabled={!menuItem.isActive}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {menuItem.isActive
                  ? cartItems.some(i => i.menuItemId === menuItem.id)
                    ? 'Update Order'
                    : 'Add to Order'
                  : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
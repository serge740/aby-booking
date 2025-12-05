import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wine,
  Beer,
  Martini,
  Utensils,
  Percent,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';
import menuItemService from '../../services/menuItemService';
import { API_URL } from '../../api/api';
import { useCart } from '../../context/CartContext';
import MenuItemOrderModal from '../../components/MenuItemOrderModal';

const MenuItemDetail = () => {
  const { companyId, itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [menuItem, setMenuItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  /* -------------------------------------------------
     1. FETCH MENU ITEM ONLY (no related items)
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
      } catch (err) {
        setError(err.message || 'Failed to load menu item');
      } finally {
        setLoading(false);
      }
    };

    if (itemId && companyId) fetchMenuItem();
  }, [itemId, companyId]);

  /* -------------------------------------------------
     2. Sync quantity with cart
    ------------------------------------------------- */
  useEffect(() => {
    if (!menuItem || cartItems.length === 0) return;
    const existing = cartItems.find((i) => i.menuItemId === menuItem.id);
    setQuantity(existing?.quantity > 0 ? existing.quantity : 1);
  }, [menuItem, cartItems]);

  /* -------------------------------------------------
     3. Drink icon helper
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
     4. Loading / Error
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
     5. Price calculation
    ------------------------------------------------- */
  const finalPrice =
    menuItem.sellingPrice - menuItem.sellingPrice * (menuItem.discount / 100);
  const totalPrice = finalPrice * quantity;

  /* -------------------------------------------------
     6. Cart handlers
    ------------------------------------------------- */
  const handleAddToCart = () => {
    if (!menuItem.isActive) return;

    const payload = {
      ...menuItem,
      menuItemId: menuItem.id,
      quantity,
      unitPrice: finalPrice,
      totalPrice,
      companyId,
      companyName: menuItem.company?.name || 'Restaurant',
      companyLogo: menuItem.company?.logo
        ? `${API_URL}${menuItem.company.logo}`
        : null,
      image: menuItem.mainImage,
    };

    const existing = cartItems.find((i) => i.menuItemId === menuItem.id);
    if (existing) {
      updateQuantity(menuItem.id, quantity);
    } else {
      addToCart(payload);
    }
  };

  const handleOrderNow = () => {
    if (!menuItem.isActive) return;

    const payload = {
      ...menuItem,
      menuItemId: menuItem.id,
      quantity,
      unitPrice: finalPrice,
      totalPrice,
      companyId,
      companyName: menuItem.company?.name || 'Restaurant',
      companyLogo: menuItem.company?.logo
        ? `${API_URL}${menuItem.company.logo}`
        : null,
      image: menuItem.mainImage,
    };

    // Keep other companies' items, replace this company's items with just this one
    const otherCompanyItems = cartItems.filter((i) => i.companyId !== companyId);
    otherCompanyItems.forEach((item) => addToCart(item));
    addToCart(payload); // this will replace the previous one for this company

    setIsOrderModalOpen(true);
  };

  /* -------------------------------------------------
     7. Render
    ------------------------------------------------- */
  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="mx-auto p-6 ">
        {/* Simple breadcrumb (no category) */}
        <div className="text-sm text-gray-600 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-orange-600">
            Menu
          </button>{' '}
          / <span className="text-gray-900 font-medium">{menuItem.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images – now takes full left side on large screens */}
          <div className="space-y-6">
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

            {/* Thumbnails */}
            <div className="flex items-center gap-2 flex-wrap">
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
                    selectedImage === img ? 'border-orange-500' : 'border-gray-200'
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

          {/* Details – now takes the remaining 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & purpose icon */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                {menuItem.purpose === 'EATING' ? (
                  <Utensils className="w-4 h-4" />
                ) : (
                  getDrinkIcon(menuItem.alcoholicType)
                )}
                <span className="font-medium capitalize">
                  {menuItem.purpose === 'EATING' ? 'Food' : 'Drink'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {menuItem.name}
              </h1>
              {menuItem.description && (
                <div
                  className="text-sm text-gray-600 ql-editor leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: menuItem.description }}
                />
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatRWF(finalPrice)}
                </span>
                {menuItem.discount > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatRWF(menuItem.sellingPrice)}
                  </span>
                )}
              </div>
              {menuItem.discount > 0 && (
                <p className="text-green-600 font-medium">
                  You save {formatRWF(menuItem.sellingPrice - finalPrice)}
                </p>
              )}
            </div>

            {/* Drink info */}
            {menuItem.purpose === 'DRINKING' && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wine className="w-5 h-5 text-orange-500" />
                  Drink Information
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    {menuItem.drinkState === 'ALCOHOLIC'
                      ? `${menuItem.alcoholicType} (Alcoholic)`
                      : 'Non-Alcoholic'}
                  </span>
                </div>
              </div>
            )}

            {/* Food extras */}
            {menuItem.purpose === 'EATING' && (
              <>
                {menuItem.ingredients?.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Ingredients</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-4">Preparation</h3>
                    <p className="text-gray-700 leading-relaxed">{menuItem.recipe}</p>
                  </div>
                )}
              </>
            )}

            {/* Quantity + Buttons */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
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
                  {formatRWF(totalPrice)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!menuItem.isActive}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {menuItem.isActive
                    ? cartItems.some((i) => i.menuItemId === menuItem.id)
                      ? 'Update Cart'
                      : 'Add to Cart'
                    : 'Unavailable'}
                </button>

                <button
                  onClick={handleOrderNow}
                  disabled={!menuItem.isActive}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <MenuItemOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        companyId={companyId}
      />
    </div>
  );
};

// RWF formatter
const formatRWF = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default MenuItemDetail;
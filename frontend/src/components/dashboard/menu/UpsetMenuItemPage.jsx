// src/pages/MenuItemPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Check, Upload, X,
  Utensils, Wine, DollarSign, Image as ImageIcon,
  AlertCircle, Package
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import menuItemService from '../../../services/menuItemService';
import stockService from '../../../services/stockService';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../../api/api';

function MenuItemForm({ itemToEdit = null, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drinkingStocks, setDrinkingStocks] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purpose: 'EATING',
    drinkState: '',
    alcoholicType: '',
    ingredients: [],
    recipe: '',
    sellingPrice: '',
    purchasingPrice: '',
    discount: 0,
    isActive: true,
    tags: [],
    stockId: ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [otherImagesFiles, setOtherImagesFiles] = useState([]);
  const [otherImagesPreviews, setOtherImagesPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [tagInput, setTagInput] = useState('');
  const [ingredientName, setIngredientName] = useState('');

  // Load DRINKING stocks on mount
  useEffect(() => {
    const loadDrinkingStocks = async () => {
      try {
        const stocks = await stockService.getAllStockByPurpose('DRINKING');
        setDrinkingStocks(stocks);
      } catch (err) {
        console.error('Failed to load drinking stocks:', err);
      }
    };
    loadDrinkingStocks();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        description: itemToEdit.description || '',
        purpose: itemToEdit.purpose || 'EATING',
        drinkState: itemToEdit.drinkState || '',
        alcoholicType: itemToEdit.alcoholicType || '',
        ingredients: Array.isArray(JSON.parse(itemToEdit.ingredients)) ? JSON.parse(itemToEdit.ingredients) : [],
      
        sellingPrice: itemToEdit.sellingPrice?.toString() || '',
        purchasingPrice: itemToEdit.purchasingPrice?.toString() || '',
        discount: itemToEdit.discount || 0,
        isActive: itemToEdit.isActive !== false,
    
        stockId: itemToEdit?.stockId || ''
      });

      if (itemToEdit.mainImage) setMainImagePreview(itemToEdit.mainImage ?`${API_URL}${itemToEdit.mainImage}` : '');
      if (itemToEdit.otherImages && Array.isArray(itemToEdit.otherImages)) {
        setOtherImagesPreviews(itemToEdit.otherImages);
      }
    }
  }, [itemToEdit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Auto-fill prices when stock is selected
  const handleStockChange = (stockId) => {
    const selectedStock = drinkingStocks.find(s => s.id === stockId);
    if (selectedStock) {
      setFormData(prev => ({
        ...prev,
        stockId,
        name: prev.name || selectedStock.name,
        sellingPrice: selectedStock.sellingPrice.toString(),
        purchasingPrice: selectedStock.purchasingPrice?.toString() || '0'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        stockId: '',
        purchasingPrice: '',
        sellingPrice: prev.sellingPrice // keep selling price if user already changed
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const addIngredient = () => {
    if (ingredientName.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientName.trim()]
      }));
      setIngredientName('');
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + otherImagesFiles.length + otherImagesPreviews.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    setOtherImagesFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOtherImagesPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview('');
    if (itemToEdit?.mainImage) {
      setRemovedImages(prev => [...prev, itemToEdit.mainImage]);
    }
  };

  const removeOtherImage = (index) => {
    const preview = otherImagesPreviews[index];
    if (preview && preview.startsWith('/uploads')) {
      setRemovedImages(prev => [...prev, preview]);
    }
    setOtherImagesPreviews(prev => prev.filter((_, i) => i !== index));
    setOtherImagesFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.name.trim()) return setError('Item name is required');
      if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) return setError('Valid selling price is required');

      if (formData.purpose === 'EATING' && formData.ingredients.length === 0) return setError('At least one ingredient is required');
    

      const dataToSend = {
        ...formData,
        ingredients: formData.purpose === 'EATING' ? formData.ingredients : undefined,
        recipe: formData.purpose === 'EATING' ? formData.recipe : undefined,
        drinkState: formData.purpose === 'DRINKING' ? formData.drinkState : undefined,
        alcoholicType: formData.purpose === 'DRINKING' && formData.drinkState === 'ALCOHOLIC' ? formData.alcoholicType : undefined,
        purchasingPrice: formData.purpose === 'DRINKING' ? parseFloat(formData.purchasingPrice) || 0 : undefined,
        difference: formData.purpose === 'DRINKING' && formData.sellingPrice && formData.purchasingPrice
          ? parseFloat(formData.sellingPrice) - parseFloat(formData.purchasingPrice)
          : undefined,
        stockId: formData.purpose === 'DRINKING' ? formData?.stockId : null,
    
        removedImages: removedImages.length > 0 ? removedImages : undefined
      };

      let result;
      if (itemToEdit) {
        result = await menuItemService.updateMenuItem(itemToEdit.id, dataToSend, mainImageFile, otherImagesFiles);
      } else {
        result = await menuItemService.createMenuItem(dataToSend, mainImageFile, otherImagesFiles);
      }

      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {itemToEdit ? 'Edit Menu Item' : 'Create New Menu Item'}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('purpose', 'EATING')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition ${formData.purpose === 'EATING' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <Utensils className="w-8 h-8" />
                <span className="font-medium">Food</span>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('purpose', 'DRINKING')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition ${formData.purpose === 'DRINKING' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <Wine className="w-8 h-8" />
                <span className="font-medium">Drink</span>
              </button>
            </div>
          </div>
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Heineken, Grilled Chicken"
            />
          </div>



          {/* Stock Selection (Drinks Only) */}
          {formData.purpose === 'DRINKING' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Select Stock Item *
              </label>
              <select
                value={formData.stockId}
                onChange={(e) => handleStockChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose stock item...</option>
                {drinkingStocks.map(stock => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name} ({stock.quantity} {stock.unit}) — Cost: {stock.purchasingPrice || 0} | Sell: {stock.sellingPrice}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (RWF) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2500"
                />
              </div>
            </div>

            {formData.purpose === 'DRINKING' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchasing Price (Cost) — Auto-filled
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.purchasingPrice}
                   onChange={(e) => handleInputChange('purchasingPrice', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 c"
                  />
                </div>
                {formData.sellingPrice && formData.purchasingPrice > 0 && (
                  <p className="mt-2 text-sm font-medium text-green-600">
                    Profit: {(parseFloat(formData.sellingPrice) - parseFloat(formData.purchasingPrice)).toLocaleString()} RWF
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Drink Details */}
          {formData.purpose === 'DRINKING' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drink State *</label>
                <select
                  value={formData.drinkState}
                  onChange={(e) => handleInputChange('drinkState', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select drink state</option>
                  <option value="ALCOHOLIC">Alcoholic</option>
                  <option value="NON_ALCOHOLIC">Non-Alcoholic</option>
                </select>
              </div>
              {formData.drinkState === 'ALCOHOLIC' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alcoholic Type *</label>
                  <select
                    value={formData.alcoholicType}
                    onChange={(e) => handleInputChange('alcoholicType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="LIQUOR">Liquor</option>
                    <option value="WINE">Wine</option>
                    <option value="BEER">Beer</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Food Details */}
          {formData.purpose === 'EATING' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    placeholder="e.g., Chicken, Rice, Spices"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button type="button" onClick={addIngredient} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{ing}</span>
                      <button type="button" onClick={() => removeIngredient(idx)} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            
            </>
          )}

         
          {/* Description */}
          <div className=''>
  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
  <textarea
    value={formData.description}
    onChange={(e) => handleInputChange('description', e.target.value)}
    className="bg-white rounded-lg p-2 w-full text-sm border border-gray-300 h-20"
    placeholder="Describe your menu item..."
  />
</div>


          {/* Images */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              {mainImagePreview ? (
                <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img src={mainImagePreview} alt="Main" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeMainImage} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload main image</span>
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Images (Max 10)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {otherImagesPreviews.map((preview, idx) => (
                  <div key={idx} className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img src={preview} alt={`Other ${idx}`} className="w-full h-32 object-cover" />
                    <button type="button" onClick={() => removeOtherImage(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {otherImagesPreviews.length < 10 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add more images</span>
                  <input type="file" accept="image/*" multiple onChange={handleOtherImagesChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Active Item</label>
          </div>

          {/* Submit Buttons */}
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button type="button" onClick={onCancel || (() => window.history.back())} className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{itemToEdit ? 'Update Item' : 'Create Item'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditMenuItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        setLoading(true);
        const response = await menuItemService.getOneMenuItem(id);
        setItem(response);
      } catch (error) {
        console.error('Failed to load menu item:', error);
        alert('Failed to load menu item');
        navigate('/company/dashboard/menu-item');
      } finally {
        setLoading(false);
      }
    };
    loadMenuItem();
  }, [id, navigate]);

  const handleSuccess = () => {
    alert('Menu item updated successfully!');
    navigate('/company/dashboard/menu-item');
  };

  const handleCancel = () => {
    navigate('/company/dashboard/menu-item');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <MenuItemForm itemToEdit={item} onSuccess={handleSuccess} onCancel={handleCancel} />;
}

export function CreateMenuItemPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    alert('Menu item created successfully!');
    navigate('/company/dashboard/menu-item');
  };

  const handleCancel = () => {
    navigate('/company/dashboard/menu-item');
  };

  return <MenuItemForm onSuccess={handleSuccess} onCancel={handleCancel} />;
}
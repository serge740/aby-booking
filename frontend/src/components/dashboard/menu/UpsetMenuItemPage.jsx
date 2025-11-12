// src/pages/MenuItemPage.jsx
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Check, Upload, X,
  Utensils, Wine, DollarSign, Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import menuItemService from '../../../services/menuItemService';
import menuCategoryService from '../../../services/menuCategoryService';
import { useNavigate, useParams } from 'react-router-dom';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Utensils },
  { id: 2, name: 'Purpose & Details', icon: Wine },
  { id: 3, name: 'Pricing', icon: DollarSign },
  { id: 4, name: 'Images', icon: ImageIcon },
  { id: 5, name: 'Review', icon: Check }
];

function MenuItemForm({ itemToEdit = null, onSuccess, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    purpose: 'EATING',
    drinkState: '',
    alcoholicType: '',
    ingredients: [], // Now only strings: ['Tomato', 'Cheese', ...]
    recipe: '',
    sellingPrice: '',
    purchasingPrice: '',
    discount: 0,
    isActive: true
  });

  // Image states
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [otherImagesFiles, setOtherImagesFiles] = useState([]);
  const [otherImagesPreviews, setOtherImagesPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // Ingredient input: only name
  const [ingredientName, setIngredientName] = useState('');

  useEffect(() => {
    loadCategories();
    if (itemToEdit) {
      populateFormData();
    }
  }, [itemToEdit]);

  const loadCategories = async () => {
    try {
      const data = await menuCategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const populateFormData = () => {
    setFormData({
      name: itemToEdit.name || '',
      description: itemToEdit.description || '',
      categoryId: itemToEdit.categoryId || '',
      purpose: itemToEdit.purpose || 'EATING',
      drinkState: itemToEdit.drinkState || '',
      alcoholicType: itemToEdit.alcoholicType || '',
      ingredients: !Array.isArray(itemToEdit.ingredients)
        ? JSON.parse(itemToEdit.ingredients)
        : (itemToEdit.ingredients || []),
      recipe: itemToEdit.recipe || '',
      sellingPrice: itemToEdit.sellingPrice?.toString() || '',
      purchasingPrice: itemToEdit.purchasingPrice?.toString() || '',
      discount: itemToEdit.discount || 0,
      isActive: itemToEdit.isActive !== false
    });

    if (itemToEdit.mainImage) {
      setMainImagePreview(itemToEdit.mainImage);
    }
    if (itemToEdit.otherImages && Array.isArray(itemToEdit.otherImages)) {
      setOtherImagesPreviews(itemToEdit.otherImages);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
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

  const validateStep = () => {
    setError('');
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setError('Name is required');
          return false;
        }
        break;
      case 2:
        if (formData.purpose === 'DRINKING' && !formData.drinkState) {
          setError('Drink state is required for drinks');
          return false;
        }
        if (formData.purpose === 'DRINKING' && formData.drinkState === 'ALCOHOLIC' && !formData.alcoholicType) {
          setError('Alcoholic type is required for alcoholic drinks');
          return false;
        }
        if (formData.purpose === 'EATING' && formData.ingredients.length === 0) {
          setError('At least one ingredient is required for food items');
          return false;
        }
        if (formData.purpose === 'EATING' && !formData.recipe.trim()) {
          setError('Recipe is required for food items');
          return false;
        }
        break;
      case 3:
        if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
          setError('Valid selling price is required');
          return false;
        }
        if (formData.purpose === 'DRINKING' && (!formData.purchasingPrice || parseFloat(formData.purchasingPrice) <= 0)) {
          setError('Purchasing price is required for drinks');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      menuItemService.validateMenuItem(formData);

      const dataToSend = {
        ...formData,
        ingredients: formData.purpose === 'EATING' ? formData.ingredients : undefined,
        recipe: formData.purpose === 'EATING' ? formData.recipe : undefined,
        drinkState: formData.purpose === 'DRINKING' ? formData.drinkState : undefined,
        alcoholicType: formData.purpose === 'DRINKING' && formData.drinkState === 'ALCOHOLIC' ? formData.alcoholicType : undefined,
        purchasingPrice: formData.purpose === 'DRINKING' ? formData.purchasingPrice : undefined,
        difference:
          formData.purpose === 'DRINKING' && formData.sellingPrice && formData.purchasingPrice
            ? parseFloat(formData.sellingPrice) - parseFloat(formData.purchasingPrice)
            : undefined,
        removedImages: removedImages.length > 0 ? removedImages : undefined
      };

      let result;
      if (itemToEdit) {
        result = await menuItemService.updateMenuItem(
          itemToEdit.id,
          dataToSend,
          mainImageFile,
          otherImagesFiles
        );
      } else {
        result = await menuItemService.createMenuItem(
          dataToSend,
          mainImageFile,
          otherImagesFiles
        );
      }

      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Item</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                className="bg-white rounded-lg"
                placeholder="Describe your menu item..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('purpose', 'EATING')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition ${
                    formData.purpose === 'EATING'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Utensils className="w-8 h-8" />
                  <span className="font-medium">Food</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('purpose', 'DRINKING')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition ${
                    formData.purpose === 'DRINKING'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Wine className="w-8 h-8" />
                  <span className="font-medium">Drink</span>
                </button>
              </div>
            </div>

            {formData.purpose === 'DRINKING' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drink State *
                  </label>
                  <select
                    value={formData.drinkState}
                    onChange={(e) => handleInputChange('drinkState', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select drink state</option>
                    <option value="ALCOHOLIC">Alcoholic</option>
                    <option value="NON_ALCOHOLIC">Non-Alcoholic</option>
                  </select>
                </div>
                {formData.drinkState === 'ALCOHOLIC' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alcoholic Type *
                    </label>
                    <select
                      value={formData.alcoholicType}
                      onChange={(e) => handleInputChange('alcoholicType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {formData.purpose === 'EATING' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients *
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={ingredientName}
                      onChange={(e) => setIngredientName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="e.g., Chicken, Rice, Spices"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{ing}</span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe / Instructions *
                  </label>
                  <textarea
                    value={formData.recipe}
                    onChange={(e) => handleInputChange('recipe', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cooking instructions..."
                  />
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {formData.purpose === 'DRINKING' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchasing Price (Cost)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasingPrice}
                    onChange={(e) => handleInputChange('purchasingPrice', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {formData.purpose === 'DRINKING' &&
              formData.sellingPrice &&
              formData.purchasingPrice && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Profit (Difference):</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(parseFloat(formData.sellingPrice) - parseFloat(formData.purchasingPrice)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              {mainImagePreview ? (
                <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img src={mainImagePreview} alt="Main" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload main image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Images (Max 10)
              </label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {otherImagesPreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img src={preview} alt={`Other ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeOtherImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {otherImagesPreviews.length < 10 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add more images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleOtherImagesChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Menu Item</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <p className="font-medium">
                    {categories.find(c => c.id === formData.categoryId)?.name || 'None'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Purpose:</span>
                  <p className="font-medium">{formData.purpose}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <p className="font-medium">{formData.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              {formData.purpose === 'DRINKING' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Drink State:</span>
                    <p className="font-medium">{formData.drinkState}</p>
                  </div>
                  {formData.alcoholicType && (
                    <div>
                      <span className="text-sm text-gray-500">Alcoholic Type:</span>
                      <p className="font-medium">{formData.alcoholicType}</p>
                    </div>
                  )}
                </div>
              )}

              {formData.purpose === 'EATING' && formData.ingredients.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Ingredients:</span>
                  <div className="mt-2 space-y-1">
                    {formData.ingredients.map((ing, idx) => (
                      <p key={idx} className="text-sm">• {ing}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Selling Price:</span>
                  <p className="font-medium text-lg">${formData.sellingPrice}</p>
                </div>
                {formData.purpose === 'DRINKING' && formData.purchasingPrice && (
                  <div>
                    <span className="text-sm text-gray-500">Cost:</span>
                    <p className="font-medium">${formData.purchasingPrice}</p>
                  </div>
                )}
              </div>

              {formData.purpose === 'DRINKING' && formData.purchasingPrice && (
                <div>
                  <span className="text-sm text-gray-500">Profit (Difference):</span>
                  <p className="font-medium">
                    ${(parseFloat(formData.sellingPrice) - parseFloat(formData.purchasingPrice)).toFixed(2)}
                  </p>
                </div>
              )}

              {formData.discount > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Discount:</span>
                  <p className="font-medium">{formData.discount}%</p>
                </div>
              )}

              {mainImagePreview && (
                <div>
                  <span className="text-sm text-gray-500 block mb-2">Main Image:</span>
                  <img src={mainImagePreview} alt="Main" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {itemToEdit ? 'Edit Menu Item' : 'Create New Menu Item'}
          </h2>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel || (() => window.history.back())}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2 disabled:opacity-50"
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
            )}
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
    loadMenuItem();
  }, [id]);

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

  const handleSuccess = (updatedItem) => {
    console.log('Item updated:', updatedItem);
    alert('Menu item updated successfully!');
    navigate('/company/dashboard/menu-item');
  };

  const handleCancel = () => {
    navigate('/company/dashboard/menu-item');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <MenuItemForm
      itemToEdit={item}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

export function CreateMenuItemPage() {
  const navigate = useNavigate();

  const handleSuccess = (createdItem) => {
    console.log('Item created:', createdItem);
    alert('Menu item created successfully!');
    navigate('/company/dashboard/menu-item');
  };

  const handleCancel = () => {
    navigate('/company/dashboard/menu-item');
  };

  return (
    <MenuItemForm
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
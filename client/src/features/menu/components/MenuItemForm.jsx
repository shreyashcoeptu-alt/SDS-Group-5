import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import VegIndicator from './VegIndicator';
import { UtensilsCrossed, Image as ImageIcon, PlusCircle } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/utils/constants';

/**
 * 2026 Add / Edit Dish Form.
 * Clean, structured inputs, live image preview, inline category creation,
 * and high-contrast validation feedback.
 */
export const MenuItemForm = ({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  isSaving = false,
}) => {
  const isEditing = Boolean(initialData?._id);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const [errors, setErrors] = useState({});

  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES.filter((c) => c !== 'All'), ...categories.filter((c) => c !== 'All')])
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || allCategories[0] || 'Meals');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setDescription(initialData.description || '');
      setImage(initialData.image || '');
      setIsVeg(initialData.isVeg !== undefined ? initialData.isVeg : true);
      setIsAvailable(initialData.isAvailable !== undefined ? initialData.isAvailable : true);
    } else {
      setName('');
      setCategory(allCategories[0] || 'Breakfast');
      setPrice('');
      setDescription('');
      setImage('');
      setIsVeg(true);
      setIsAvailable(true);
      setIsCreatingNewCategory(false);
      setNewCategoryName('');
    }
    setErrors({});
    setImagePreviewError(false);
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Dish name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Dish name must be at least 2 characters';
    } else if (name.trim().length > 60) {
      newErrors.name = 'Dish name cannot exceed 60 characters';
    }

    const finalCategory = isCreatingNewCategory ? newCategoryName.trim() : category;
    if (!finalCategory) {
      newErrors.category = 'Please select or enter a category';
    } else if (finalCategory.length < 2) {
      newErrors.category = 'Category must be at least 2 characters';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum)) {
      newErrors.price = 'Price is required';
    } else if (priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {
      newErrors.price = 'Price can have at most 2 decimal places';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    if (image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        newErrors.image = 'Please enter a valid URL (e.g. https://...)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = isCreatingNewCategory ? newCategoryName.trim() : category;

    const payload = {
      name: name.trim(),
      category: finalCategory,
      price: parseFloat(price),
      description: description.trim(),
      image: image.trim(),
      isVeg,
      isAvailable,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>
      {/* Dish Name */}
      <Input
        label="Dish Name"
        required
        maxLength={60}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
        }}
        placeholder="e.g. Masala Dosa, Paneer Tikka"
        error={errors.name}
      />

      {/* Category Selection + Inline Creation */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-semibold text-black uppercase tracking-wider">
            Category <span className="text-brand-600">*</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsCreatingNewCategory(!isCreatingNewCategory);
              setErrors((prev) => ({ ...prev, category: null }));
            }}
            className="text-xs text-brand-600 hover:text-black font-heading font-bold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isCreatingNewCategory ? 'Choose Existing' : '+ New Category'}</span>
          </button>
        </div>

        {isCreatingNewCategory ? (
          <Input
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
            }}
            placeholder="Type new category (e.g. Chinese, Desserts)"
            error={errors.category}
            autoFocus
          />
        ) : (
          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
              className="w-full h-10 px-3.5 bg-white text-black text-sm font-sans rounded-xl border border-stone-200 hover:border-black focus:border-black focus:ring-1 focus:ring-black transition-all focus:outline-none appearance-none"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Price */}
      <Input
        label="Price in ₹"
        required
        prefix="₹"
        type="number"
        step="0.5"
        min="1"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
          if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
        }}
        placeholder="60.00"
        error={errors.price}
        helperText="Indian Rupees (e.g. 45 or 120.50)"
      />

      {/* Description with character counter */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-semibold text-black uppercase tracking-wider">
            Description <span className="text-brand-600">*</span>
          </label>
          <span className="text-xs text-stone-400 font-mono tabular-nums">
            {description.length}/200
          </span>
        </div>

        <textarea
          rows={3}
          maxLength={200}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
          }}
          placeholder="Describe ingredients, taste profile, and preparation..."
          className={`
            w-full bg-white text-black placeholder:text-stone-400 text-sm font-sans rounded-xl border p-3
            transition-all duration-150 resize-none
            ${errors.description
              ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-100'
              : 'border-stone-200 hover:border-black focus:border-black focus:ring-1 focus:ring-black'
            }
            focus:outline-none shadow-sm
          `}
        />
        {errors.description && (
          <p className="text-xs text-red-600 font-medium">{errors.description}</p>
        )}
      </div>

      {/* Image URL & Live Preview */}
      <div className="flex flex-col gap-2">
        <Input
          label="Image URL"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            setImagePreviewError(false);
            if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
          }}
          placeholder="https://images.unsplash.com/..."
          leftIcon={<ImageIcon className="w-4 h-4" />}
          error={errors.image}
          helperText="Direct photo link (Unsplash, Cloudinary, etc.)"
        />

        {/* Live Preview Box */}
        <div className="flex items-center gap-3.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
            {image.trim() && !imagePreviewError ? (
              <img
                src={image.trim()}
                alt="Preview"
                onError={() => setImagePreviewError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                <UtensilsCrossed className="w-5 h-5 opacity-40" />
              </div>
            )}
          </div>

          <div className="flex flex-col text-xs text-stone-500">
            <span className="font-heading font-semibold text-black">Live Photo Preview</span>
            <span className="font-sans">
              {image.trim()
                ? imagePreviewError
                  ? '⚠️ Failed to load image. Will show fallback.'
                  : '✓ Image preview verified.'
                : 'No URL provided. Will use fallback illustration.'}
            </span>
          </div>
        </div>
      </div>

      {/* Dietary Classification (Veg / Non-veg radio) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-heading font-semibold text-black uppercase tracking-wider">
          Dietary Classification <span className="text-brand-600">*</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          <label
            className={`
              flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none
              ${isVeg
                ? 'bg-emerald-50/70 border-emerald-600 shadow-sm'
                : 'bg-white border-stone-200 hover:bg-stone-50'
              }
            `}
          >
            <input
              type="radio"
              name="dietary"
              checked={isVeg}
              onChange={() => setIsVeg(true)}
              className="sr-only"
            />
            <VegIndicator isVeg={true} size="md" />
            <div className="flex flex-col">
              <span className="text-xs font-heading font-bold text-emerald-950">Vegetarian</span>
              <span className="text-[10px] text-emerald-700 font-mono">Green mark</span>
            </div>
          </label>

          <label
            className={`
              flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none
              ${!isVeg
                ? 'bg-red-50/70 border-red-600 shadow-sm'
                : 'bg-white border-stone-200 hover:bg-stone-50'
              }
            `}
          >
            <input
              type="radio"
              name="dietary"
              checked={!isVeg}
              onChange={() => setIsVeg(false)}
              className="sr-only"
            />
            <VegIndicator isVeg={false} size="md" />
            <div className="flex flex-col">
              <span className="text-xs font-heading font-bold text-red-950">Non-Veg</span>
              <span className="text-[10px] text-red-700 font-mono">Red mark</span>
            </div>
          </label>
        </div>
      </div>

      {/* Availability Status */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-heading font-bold text-black uppercase tracking-wider">Available for Ordering</span>
          <span className="text-xs text-stone-500 font-sans">
            {isAvailable ? 'Item will appear in the customer menu' : 'Item will be displayed as Sold Out'}
          </span>
        </div>

        <Switch
          checked={isAvailable}
          onChange={setIsAvailable}
          id="item-available-switch"
          activeColor="bg-emerald-600"
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="font-heading text-xs uppercase tracking-wider"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          className="px-6 font-heading font-bold uppercase tracking-wider text-xs"
        >
          {isEditing ? 'Save Changes' : 'Publish Dish'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;

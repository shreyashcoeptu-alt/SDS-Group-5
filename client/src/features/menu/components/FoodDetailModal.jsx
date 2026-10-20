import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import VegIndicator from './VegIndicator';
import formatCurrency from '@/utils/formatCurrency';
import { Plus, UtensilsCrossed, Check } from 'lucide-react';

/**
 * 2026 High-Impact Food Detail Modal.
 * Full-width hero photography, Lovelo Black title, Clash Grotesk metadata, and tactile CTA.
 */
export const FoodDetailModal = ({
  item,
  isOpen,
  onClose,
  onAdd,
}) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!item) return null;

  const {
    name,
    category,
    price,
    description,
    image,
    isVeg,
    isAvailable,
  } = item;

  const handleAdd = () => {
    if (!isAvailable) return;
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);

    /* 
     * INTEGRATION STUB: Cart Feature (Student 3)
     * Replace with Student 3's useCart().addItem(item)
     */
    if (onAdd) {
      onAdd(item);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      className="p-0 overflow-hidden"
    >
      <div className="-m-6">
        {/* Large Food Photography */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
          {image && !imageError ? (
            <img
              src={image}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center">
              <UtensilsCrossed className="w-12 h-12 mb-2 opacity-40" />
              <span className="text-xs font-heading font-semibold uppercase tracking-wider">Campus Kitchen Fresh</span>
            </div>
          )}

          {/* Sold out overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-1.5 bg-black text-white text-xs font-title font-bold uppercase tracking-widest rounded-lg border border-white/20">
                Currently Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 flex flex-col gap-4 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <VegIndicator isVeg={isVeg} size="sm" showLabel />
                <span className="text-stone-300">•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-heading font-semibold">
                  {category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-title uppercase tracking-tight text-black leading-tight">
                {name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono block">Price</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-black tabular-price">
                {formatCurrency(price)}
              </span>
            </div>
          </div>

          <div className="py-1">
            <h4 className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-1.5">
              Description & Ingredients
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              {description}
            </p>
          </div>

          {!isAvailable && (
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0" />
              <span>Marked sold out for today. Next batch will be served during upcoming meal service.</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-5 font-heading text-xs uppercase tracking-wider"
            >
              Dismiss
            </Button>

            <Button
              variant="primary"
              disabled={!isAvailable}
              onClick={handleAdd}
              leftIcon={justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              className="flex-1 sm:flex-initial sm:px-8 font-heading text-xs uppercase tracking-wider font-bold"
            >
              {justAdded ? 'Added to Order!' : isAvailable ? `Add ${formatCurrency(price)}` : 'Sold Out'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FoodDetailModal;

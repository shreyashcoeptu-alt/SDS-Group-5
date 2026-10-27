import React from 'react';
import { Clock, Flame, BellRing, CheckCircle2, XCircle } from 'lucide-react';

const STEPS = [
  {
    key: 'pending',
    label: 'Order Received',
    description: 'Sent to cafeteria kitchen queue',
    icon: Clock,
  },
  {
    key: 'preparing',
    label: 'Preparing Meal',
    description: 'Chef is cooking your dishes fresh',
    icon: Flame,
  },
  {
    key: 'ready',
    label: 'Ready at Counter',
    description: 'Collect your order at the pickup counter',
    icon: BellRing,
  },
  {
    key: 'completed',
    label: 'Picked Up',
    description: 'Order completed. Enjoy your meal!',
    icon: CheckCircle2,
  },
];

export const OrderTrackerStepper = ({ status = 'pending' }) => {
  if (status === 'cancelled') {
    return (
      <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-heading font-bold text-red-950 uppercase tracking-wider">
            Order Cancelled
          </h4>
          <p className="text-xs text-red-700 mt-0.5">
            This order was cancelled. If you paid online, any applicable refund will be processed automatically.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIdx || status === 'completed';
        const isCurrent = index === currentIdx && status !== 'completed';

        return (
          <div
            key={step.key}
            className={`
              relative p-4 rounded-2xl border transition-all flex sm:flex-col items-start gap-3
              ${isCurrent
                ? 'bg-black text-white border-black shadow-card ring-2 ring-black/10'
                : isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-black'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }
            `}
          >
            <div className="flex items-center justify-between w-auto sm:w-full">
              <div
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                  ${isCurrent
                    ? 'bg-brand-600 text-white'
                    : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                0{index + 1}
              </span>
            </div>

            <div className="flex-1">
              <p
                className={`text-xs font-heading font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-emerald-950' : 'text-stone-400'
                }`}
              >
                {step.label}
              </p>
              <p
                className={`text-[11px] mt-0.5 leading-snug ${
                  isCurrent ? 'text-stone-300' : isCompleted ? 'text-emerald-800/80' : 'text-stone-400'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTrackerStepper;
import React from 'react';
import type { OptionItem } from '../types/contract';
import { ShoppingCart, RefreshCw, MessageSquare, X } from 'lucide-react';

interface ActionBarProps {
  options: OptionItem[];
  onActionClick: (option: OptionItem) => void;
  isLoading?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ options, onActionClick, isLoading = false }) => {
  if (!options || options.length === 0) return null;

  const getOptionIcon = (kind: string) => {
    switch (kind) {
      case 'confirm_order':
        return ShoppingCart;
      case 'adjust_amount':
        return RefreshCw;
      case 'ask_followup':
        return MessageSquare;
      default:
        return X;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs text-zinc-600 font-semibold px-2">
        Available next steps:
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const Icon = getOptionIcon(opt.kind);
          const isPrimary = opt.kind === 'confirm_order';

          return (
            <div key={opt.id} className="relative group">
              <button
                type="button"
                disabled={!opt.enabled || isLoading}
                onClick={() => onActionClick(opt)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs ${
                  isPrimary
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-white text-zinc-800 border border-black/5 hover:border-black/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>

              {!opt.enabled && opt.disabled_reason && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-zinc-900 text-white text-[11px] shadow-lg text-center z-50">
                  {opt.disabled_reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { getCategoryConfig } from '../utils/categoryConfig';

export default function HistoryPanel({ history, onClear, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={14} />
          <span className="text-sm font-medium">Recent Classifications</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {history.map((item) => {
          const config = getCategoryConfig(item.category);
          return (
            <button
              key={item.id}
              onClick={() => onSelect && onSelect(item)}
              className={`flex-shrink-0 relative group rounded-xl overflow-hidden w-20 aspect-square border ${config.border} hover:scale-105 transition-transform`}
            >
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.itemName}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className={`w-full h-full ${config.bg} flex items-center justify-center text-2xl`}>
                  {config.emoji}
                </div>
              )}
              {/* Category dot */}
              <div className={`absolute bottom-1 left-1 right-1 text-center`}>
                <span className={`text-[9px] font-bold ${config.badge} text-white px-1 py-0.5 rounded`}>
                  {config.label.split('/')[0].trim()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

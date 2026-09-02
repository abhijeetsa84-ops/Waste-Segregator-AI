import React from 'react';
import {
  RotateCcw, Trash2, MapPin, Lightbulb,
  CheckCircle, AlertCircle, Leaf, Recycle,
  AlertTriangle, Cpu, Heart, Package
} from 'lucide-react';
import { getCategoryConfig } from '../utils/categoryConfig';
import CategoryBadge from './CategoryBadge';

const ICONS = {
  ORGANIC: Leaf,
  RECYCLABLE: Recycle,
  HAZARDOUS: AlertTriangle,
  'E-WASTE': Cpu,
  SANITARY: Heart,
  RESIDUAL: Package
};

export default function ResultCard({ result, previewUrl, onReset }) {
  const config = getCategoryConfig(result.category);
  const Icon = ICONS[result.category] || Package;
  const confidencePct = Math.round((result.confidence || 0) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 md:space-y-4 animate-slideUp pb-4">
      {/* Demo mode banner */}
      {result.isDemo && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-yellow-700 text-[10px]">
          <AlertCircle size={14} />
          <span>
            <strong>Demo Mode</strong> — Add your <code className="bg-white px-1 border border-yellow-200 rounded">GEMINI_API_KEY</code> to{' '}
            <code className="bg-white px-1 border border-yellow-200 rounded">server/.env</code> for real AI classification
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        {/* Image preview */}
        <div className="md:col-span-2">
          <div className={`relative rounded-2xl overflow-hidden border ${config.border} bg-white shadow-sm`}>
            <img src={previewUrl} alt="Classified waste" className="w-full h-48 md:h-full md:aspect-[4/3] object-cover" />
            {/* Category overlay */}
            <div className={`absolute top-2 left-2`}>
              <CategoryBadge category={result.category} size="sm" />
            </div>
            {/* Confidence overlay */}
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200">
              <span className="text-[10px] text-gray-700 font-semibold">{confidencePct}% confident</span>
            </div>
          </div>
        </div>

        {/* Main result */}
        <div className={`md:col-span-3 bg-white rounded-2xl p-4 md:p-5 border ${config.border} shadow-sm flex flex-col justify-between`}>
          {/* Item name + category */}
          <div className="flex items-start gap-2 flex-wrap mb-3">
            <span className="text-2xl md:text-3xl">{config.emoji}</span>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 capitalize leading-tight">{result.itemName}</h3>
              <p className={`text-xs md:text-sm font-medium ${config.text} mt-0.5`}>{config.description}</p>
            </div>
          </div>

          {/* Reason */}
          <div className={`flex gap-2 text-xs md:text-sm text-gray-600 ${config.bg} rounded-xl p-3 mb-4`}>
            <CheckCircle size={16} className={`${config.text} flex-shrink-0 mt-0.5`} />
            <p className="leading-snug">{result.reason}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            {/* Confidence bar */}
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-[10px] md:text-xs text-gray-500">
                <span>AI Confidence</span>
                <span className={`font-semibold ${config.text}`}>{confidencePct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${config.bar}`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* Bin info */}
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${config.bg} border ${config.border} self-start sm:self-auto w-full sm:w-auto`}>
              <Icon size={18} className={config.text} />
              <div>
                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider leading-none mb-1">Dispose in</p>
                <p className={`text-xs md:text-sm font-bold ${config.text} leading-none`}>{config.binColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advice + Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Disposal advice */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <h4 className="font-semibold text-gray-900 text-sm">Disposal Instructions</h4>
          </div>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{result.advice}</p>
        </div>

        {/* Tips */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <h4 className="font-semibold text-gray-900 text-sm">Eco Tips</h4>
          </div>
          <ul className="space-y-2">
            {(result.tips || []).map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs md:text-sm text-gray-600 leading-snug">
                <span className="text-green-500 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all duration-200 md:hover:scale-105 shadow-sm text-sm"
        >
          <RotateCcw size={16} />
          Classify Another
        </button>
      </div>
    </div>
  );
}

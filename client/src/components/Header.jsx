import React from 'react';
import { Recycle, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-[#FAFAFA]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
            <Recycle size={22} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-gray-900 tracking-tight">
              WasteAI
            </h1>
            <p className="text-xs text-gray-500 leading-none mt-1">Smart Segregator</p>
          </div>
        </div>

        {/* Category legend */}
        <nav className="hidden md:flex items-center gap-4 text-xs">
          {[
            { emoji: '🥦', label: 'Organic', color: 'text-green-600' },
            { emoji: '♻️', label: 'Recyclable', color: 'text-blue-600' },
            { emoji: '⚠️', label: 'Hazardous', color: 'text-red-600' },
            { emoji: '💻', label: 'E-Waste', color: 'text-purple-600' },
            { emoji: '🩺', label: 'Sanitary', color: 'text-amber-600' },
            { emoji: '🪨', label: 'Residual', color: 'text-gray-600' }
          ].map(({ emoji, label, color }) => (
            <span key={label} className={`flex items-center gap-1.5 ${color} font-medium`}>
              <span className="text-sm opacity-80">{emoji}</span>
              <span className="hidden lg:inline">{label}</span>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="hidden sm:inline">Powered by</span>
          <span className="font-semibold text-gray-800">Gemini</span>
        </div>
      </div>
    </header>
  );
}

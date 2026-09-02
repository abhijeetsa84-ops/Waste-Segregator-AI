import React from 'react';

export default function LoadingSpinner({ previewUrl }) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 animate-fadeIn">
      {/* Image preview with scanning animation */}
      {previewUrl && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
          <img
            src={previewUrl}
            alt="Analysing..."
            className="w-full h-full object-cover opacity-80"
          />
          {/* Scan beam */}
          <div className="absolute inset-0">
            <div
              className="scan-beam absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-sm"
              style={{ top: '0%' }}
            />
          </div>
          {/* Corner brackets */}
          {[
            'top-3 left-3 border-t-2 border-l-2',
            'top-3 right-3 border-t-2 border-r-2',
            'bottom-3 left-3 border-b-2 border-l-2',
            'bottom-3 right-3 border-b-2 border-r-2'
          ].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 border-green-500/50 ${cls}`} />
          ))}
        </div>
      )}

      {/* Status text */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900">Analyzing...</h3>
        </div>
      </div>

    </div>
  );
}

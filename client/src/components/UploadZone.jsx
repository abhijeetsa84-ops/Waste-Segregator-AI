import React, { useCallback, useRef, useState } from 'react';
import { Upload, Camera, ImagePlus, X } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];

export default function UploadZone({ onFileSelect, disabled }) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onFileChange = useCallback((e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 md:space-y-3 animate-slideUp">
      {/* Hero text */}
      <div className="text-center space-y-1 md:space-y-1.5 mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          AI Waste Classifier
        </h2>
        <p className="text-gray-500 text-sm md:text-base px-2">
          Upload a photo of any waste item and get instant AI-powered disposal guidance
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 md:p-8
          transition-all duration-300 text-center bg-white
          ${dragging
            ? 'border-green-500 bg-green-50 scale-[1.02]'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="relative flex flex-col items-center gap-2 md:gap-3">
          <div className={`
            w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300
            ${dragging
              ? 'bg-green-100 scale-110'
              : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-105'
            }
          `}>
            {dragging ? (
              <ImagePlus size={24} className="text-green-600 md:w-7 md:h-7" />
            ) : (
              <Upload size={24} className="text-gray-500 group-hover:text-gray-700 transition-colors md:w-7 md:h-7" />
            )}
          </div>

          <div>
            <p className="text-gray-900 font-semibold text-sm md:text-base">
              {dragging ? 'Release to classify!' : 'Drop your image here'}
            </p>
            <p className="text-gray-500 text-[11px] md:text-xs mt-1">
              or <span className="text-green-600 font-medium hover:underline">click to browse</span> your files
            </p>
          </div>

          <p className="text-gray-400 text-[9px] md:text-[10px]">
            Supports JPG, PNG, WebP · Up to 20MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Camera capture button */}
      <div className="flex items-center gap-3 py-0.5 md:py-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-[9px] md:text-[10px] uppercase tracking-wider font-semibold">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        onClick={() => !disabled && cameraInputRef.current?.click()}
        disabled={disabled}
        className={`
          w-full flex items-center justify-center gap-2 py-3 md:py-3 rounded-xl border
          border-gray-200 bg-white text-gray-700 font-medium text-sm shadow-sm
          hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Camera size={18} className="text-gray-500" />
        Take a Photo with Camera
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Quick category reference */}
      <div className="pt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { emoji: '🥦', label: 'Organic', color: 'green' },
          { emoji: '♻️', label: 'Recyclable', color: 'blue' },
          { emoji: '⚠️', label: 'Hazardous', color: 'red' },
          { emoji: '💻', label: 'E-Waste', color: 'purple' },
          { emoji: '🩺', label: 'Sanitary', color: 'yellow' },
          { emoji: '🪨', label: 'Residual', color: 'gray' }
        ].map(({ emoji, label, color }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-lg md:rounded-xl p-1.5 md:p-2 text-center space-y-0.5 md:space-y-1 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="text-lg md:text-xl">{emoji}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis px-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

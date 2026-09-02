import React from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import { useClassifier } from './hooks/useClassifier';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const { status, previewUrl, result, error, classify, reset } = useClassifier();

  const handleFileSelect = (file) => {
    classify(file);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] flex flex-col text-gray-900 relative">
      {/* Subtle dotted background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-[100dvh] w-full">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 md:py-2 flex items-center justify-center">
        {status === 'idle' && (
          <UploadZone onFileSelect={handleFileSelect} disabled={false} />
        )}

        {status === 'loading' && (
          <LoadingSpinner previewUrl={previewUrl} />
        )}

        {status === 'success' && result && (
          <ResultCard result={result} previewUrl={previewUrl} onReset={reset} />
        )}

        {status === 'error' && (
          <div className="w-full max-w-md mx-auto text-center animate-fadeIn">
            <div className="flex flex-col items-center gap-3 glass p-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Classification Failed</h3>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors text-sm w-full mt-2"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-4 text-center flex-shrink-0 bg-[#FAFAFA]/80 backdrop-blur-sm">
          <p className="text-gray-500 text-xs">
            WasteAI — Minimalist AI Segregator &nbsp;·&nbsp; Powered by Google Gemini
          </p>
        </footer>
      </div>
    </div>
  );
}

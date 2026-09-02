import React, { useEffect, useState } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { ShieldAlert, X } from 'lucide-react';

export default function CaptchaModal({ onVerify, onCancel }) {
  const [captchaValue, setCaptchaValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Load a 6-character captcha when component mounts
    loadCaptchaEnginge(6);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCaptcha(captchaValue)) {
      onVerify();
    } else {
      setError(true);
      setCaptchaValue('');
      // Reload captcha on failure
      loadCaptchaEnginge(6);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <ShieldAlert size={18} className="text-gray-500" />
            Security Check
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex justify-center border border-gray-200 rounded-lg p-2 bg-gray-50">
            <LoadCanvasTemplate reloadText="Reload Captcha" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
              Enter the characters shown above
            </label>
            <input
              id="captcha"
              type="text"
              value={captchaValue}
              onChange={(e) => {
                setCaptchaValue(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-100 focus:border-green-500'
              }`}
              placeholder="Type characters here..."
              autoFocus
              required
            />
            {error && <p className="text-xs text-red-500 font-medium mt-1">Incorrect verification code. Please try again.</p>}
          </div>

          <button
            type="submit"
            disabled={!captchaValue.trim()}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify & Upload
          </button>
        </form>
      </div>
    </div>
  );
}

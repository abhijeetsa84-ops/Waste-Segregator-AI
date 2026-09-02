import { useState, useCallback } from 'react';
import { resizeImage, createPreviewUrl } from '../utils/imageUtils';

const MAX_HISTORY = 8;

export function useClassifier() {
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    previewUrl: null,
    result: null,
    error: null,
    history: JSON.parse(localStorage.getItem('ws-history') || '[]')
  });

  const classify = useCallback(async (file) => {
    // Generate preview immediately
    const previewUrl = createPreviewUrl(file);
    setState(s => ({ ...s, status: 'loading', previewUrl, result: null, error: null }));

    try {
      // Resize + convert to base64
      const { base64, mimeType } = await resizeImage(file, 1024);

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const result = await response.json();

      // Persist to history
      const historyItem = {
        id: Date.now(),
        previewUrl,
        category: result.category,
        itemName: result.itemName,
        confidence: result.confidence,
        timestamp: new Date().toLocaleTimeString()
      };

      setState(prev => {
        const newHistory = [historyItem, ...prev.history].slice(0, MAX_HISTORY);
        localStorage.setItem('ws-history', JSON.stringify(newHistory));
        return { ...prev, status: 'success', result, previewUrl, history: newHistory };
      });
    } catch (err) {
      setState(s => ({ ...s, status: 'error', error: err.message || 'Unknown error occurred' }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(s => ({ ...s, status: 'idle', previewUrl: null, result: null, error: null }));
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('ws-history');
    setState(s => ({ ...s, history: [] }));
  }, []);

  return { ...state, classify, reset, clearHistory };
}

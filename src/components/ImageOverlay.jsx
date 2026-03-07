import { useEffect } from 'react';
import './ImageOverlay.css';

export default function ImageOverlay({ src, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="image-overlay" onClick={onClose}>
      <button className="overlay-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="overlay-image-wrap" onClick={e => e.stopPropagation()}>
        <img src={src} alt="Prescription" className="overlay-image" />
      </div>
    </div>
  );
}

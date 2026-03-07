import { useState, useRef } from 'react';
import { extractPrescription } from '../utils/api';
import { generateId, formatDate } from '../utils/helpers';
import { uploadImage } from '../lib/imageUpload';
import './UploadModal.css';

const MAX_SIDE = 1568; // Anthropic's recommended max dimension
const JPEG_QUALITY = 0.85;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Resize + compress an image file via canvas, returns { base64, mimeType, dataUrl }
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;

        // Scale down if needed
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width >= height) {
            height = Math.round((height * MAX_SIDE) / width);
            width = MAX_SIDE;
          } else {
            width = Math.round((width * MAX_SIDE) / height);
            height = MAX_SIDE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg', dataUrl });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadModal({ member, onClose, onSave }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64, setBase64] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  async function processFile(f) {
    if (!f) return;
    setFile(f);
    setExtracted(null);
    setError(null);

    if (f.type.startsWith('image/')) {
      // Compress image before storing base64 for API
      const { base64: b64, mimeType: mime, dataUrl } = await compressImage(f);
      setBase64(b64);
      setMimeType(mime);
      setPreviewUrl(dataUrl);
    } else {
      // PDF: read as-is
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setBase64(dataUrl.split(',')[1]);
        setMimeType('application/pdf');
        setPreviewUrl(null);
      };
      reader.readAsDataURL(f);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }

  async function handleExtract() {
    if (!base64) return;
    setLoading(true);
    setError(null);
    try {
      const data = await extractPrescription(base64, mimeType);
      setExtracted(data);
    } catch (err) {
      setError(err.message || 'Failed to extract prescription data.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    let imageUrl = null;
    if (previewUrl) {
      try {
        imageUrl = await uploadImage(previewUrl, 'prescriptions');
      } catch (err) {
        console.error('Image upload failed, saving without image:', err);
      }
    }
    const consultation = {
      id: generateId(),
      memberId: member.id,
      date: extracted.date || new Date().toISOString().split('T')[0],
      doctorName: extracted.doctorName || null,
      hospitalName: extracted.hospitalName || null,
      medicines: extracted.medicines || [],
      tests: extracted.tests || [],
      notes: extracted.notes || null,
      nextVisitDate: extracted.nextVisitDate || null,
      imageUrl,
    };
    onSave(consultation);
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Upload Prescription</div>
            {member && (
              <div className="modal-subtitle">
                Adding record for <strong>{member.name}</strong>
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!file ? (
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="drop-zone-input"
                onChange={(e) => processFile(e.target.files[0])}
              />
              <div className="drop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="drop-title">Drop prescription here</div>
              <div className="drop-subtitle">or <strong>click to browse</strong></div>
              <div className="drop-formats">JPG · PNG · WEBP · PDF</div>
            </div>
          ) : (
            <div className="file-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-image" />
              ) : (
                <div className="preview-pdf-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              )}
              <div className="preview-info">
                <div className="preview-name">{file.name}</div>
                <div className="preview-size">{formatBytes(file.size)}</div>
              </div>
              <button
                className="preview-remove"
                onClick={() => { setFile(null); setPreviewUrl(null); setBase64(null); setExtracted(null); setError(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {error && (
            <div className="error-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {extracted && (
            <div className="extracted-preview">
              <div className="extracted-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="extracted-title">Extraction complete</span>
              </div>
              <div className="extracted-fields">
                <div className="extracted-field">
                  <span className="extracted-key">date</span>
                  <span className="extracted-val">{extracted.date ? formatDate(extracted.date) : <span className="muted">not found</span>}</span>
                </div>
                <div className="extracted-field">
                  <span className="extracted-key">doctor</span>
                  <span className={`extracted-val ${!extracted.doctorName ? 'muted' : ''}`}>{extracted.doctorName || 'not found'}</span>
                </div>
                <div className="extracted-field">
                  <span className="extracted-key">hospital</span>
                  <span className={`extracted-val ${!extracted.hospitalName ? 'muted' : ''}`}>{extracted.hospitalName || 'not found'}</span>
                </div>
                <div className="extracted-field">
                  <span className="extracted-key">medicines</span>
                  <span className="extracted-val">{extracted.medicines?.length || 0} found</span>
                </div>
                <div className="extracted-field">
                  <span className="extracted-key">tests</span>
                  <span className="extracted-val">{extracted.tests?.length || 0} found</span>
                </div>
                {extracted.nextVisitDate && (
                  <div className="extracted-field">
                    <span className="extracted-key">next visit</span>
                    <span className="extracted-val">{formatDate(extracted.nextVisitDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>

          {!extracted ? (
            <button
              className="btn-extract"
              onClick={handleExtract}
              disabled={!file || loading || !base64}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" />
                  Extracting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Extract with AI
                </>
              )}
            </button>
          ) : (
            <button className="btn-save" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Save Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

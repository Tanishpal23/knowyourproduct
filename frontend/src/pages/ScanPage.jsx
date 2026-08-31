import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductByBarcode } from '../services/api';

export default function ScanPage() {
  const [mode, setMode] = useState('manual');
  const [query, setQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const navigate = useNavigate();

  const stopCamera = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current.clear();
      html5QrRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setError('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      stopCamera();
      const scanner = new Html5Qrcode('qr-reader');
      html5QrRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          stopCamera();
          handleBarcodeFound(decodedText);
        },
        () => {}
      );
      setCameraActive(true);
    } catch {
      setError('Camera access denied or not available. Please allow camera access or use manual search.');
    }
  };

  const handleBarcodeFound = async (code) => {
    setScanning(true);
    setError('');
    try {
      const res = await getProductByBarcode(code);
      navigate(`/product/${res.data.product._id}`);
    } catch {
      setError(`Product with barcode "${code}" not found. Try searching by name.`);
    }
    setScanning(false);
  };

  const handleManualBarcode = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    await handleBarcodeFound(barcode.trim());
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] page-pad">
      <div className="page-shell page-shell--md">
        <div className="text-center mb-10 fade-in-up">
          <h1 className="page-title">Scan a Product</h1>
          <p className="page-subtitle mx-auto">Use your camera, upload an image, or search manually.</p>
        </div>

        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 mb-6">
          {[['camera', 'Camera'], ['upload', 'Upload'], ['manual', 'Manual']].map(([m, label]) => (
            <button key={m} type="button" onClick={() => { setMode(m); stopCamera(); setError(''); }}
              className={`flex-1 py-2.5 min-h-11 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}>
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm fade-in" role="alert">{error}</div>
        )}

        {mode === 'camera' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="relative bg-slate-900 aspect-video" ref={scannerRef}>
              <div id="qr-reader" className="w-full h-full" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-5 px-4">
                  <div className="w-48 h-32 border-2 border-white/50 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-400 rounded-tl" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-400 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-400 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-400 rounded-br" />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs text-center px-2">Place barcode here</div>
                  </div>
                  <button type="button" onClick={startCamera} className="btn-primary">
                    Start Camera
                  </button>
                </div>
              )}
            </div>
            {cameraActive && (
              <div className="p-5 text-center">
                <p className="text-sm text-slate-500 mb-3">Hold the barcode steady within the frame</p>
                <button type="button" onClick={stopCamera} className="text-sm text-red-500 hover:text-red-700 font-medium min-h-11 px-3">Stop Camera</button>
              </div>
            )}
          </div>
        )}

        {mode === 'upload' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
              <div className="text-5xl mb-4" aria-hidden="true">📎</div>
              <p className="font-semibold text-slate-700 group-hover:text-indigo-700">Click to upload product label or barcode</p>
              <p className="text-xs text-slate-400 mt-2">JPG, PNG, WEBP supported</p>
              <input type="file" accept="image/*" className="hidden" onChange={() => setError('Image barcode scanning coming soon! Please use camera or manual entry for now.')} />
            </label>
            <p className="text-center text-xs text-slate-400 mt-5">Tip: For best results, scan barcodes using the camera option</p>
          </div>
        )}

        {mode === 'manual' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSearch} className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Search by product name</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Coca Cola, Oreo, Maggi..."
                  className="input-ring flex-1 min-w-0"
                />
                <button type="submit" className="btn-primary sm:px-6">
                  Search
                </button>
              </div>
            </form>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or</span></div></div>
            <form onSubmit={handleManualBarcode} className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Enter barcode number</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={barcode} onChange={e => setBarcode(e.target.value)}
                  placeholder="e.g. 0049000028911"
                  className="input-ring flex-1 min-w-0 font-mono"
                />
                <button type="submit" disabled={scanning} className="inline-flex items-center justify-center min-h-11 px-[18px] rounded-[10px] font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all duration-200 disabled:opacity-60 hover:-translate-y-px">
                  {scanning ? 'Looking up…' : 'Look Up'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-sm text-indigo-800 leading-relaxed border border-indigo-100">
          <strong>Tips:</strong> EAN-13, UPC-A, and QR codes are all supported. Make sure the barcode is well-lit and not blurry for best results.
        </div>
      </div>
    </div>
  );
}

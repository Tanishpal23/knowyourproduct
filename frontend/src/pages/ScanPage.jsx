import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductByBarcode, searchProducts } from '../services/api';

export default function ScanPage() {
  const [mode, setMode] = useState('manual');  // 'camera' | 'upload' | 'manual'
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
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Scan a Product</h1>
          <p className="text-slate-600">Use your camera, upload an image, or search manually.</p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 mb-6">
          {[['camera', '📷 Camera'], ['upload', '📁 Upload'], ['manual', '⌨️ Manual']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); stopCamera(); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}>
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>
        )}

        {/* CAMERA MODE */}
        {mode === 'camera' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="relative bg-slate-900 aspect-video" ref={scannerRef}>
              <div id="qr-reader" className="w-full h-full" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
                  <div className="w-48 h-32 border-2 border-white/50 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-400 rounded-tl" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-400 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-400 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-400 rounded-br" />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">Place barcode here</div>
                  </div>
                  <button onClick={startCamera} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                    Start Camera
                  </button>
                </div>
              )}
            </div>
            {cameraActive && (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-500 mb-3">Hold the barcode steady within the frame</p>
                <button onClick={stopCamera} className="text-sm text-red-500 hover:text-red-700 font-medium">Stop Camera</button>
              </div>
            )}
          </div>
        )}

        {/* UPLOAD MODE */}
        {mode === 'upload' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
              <div className="text-5xl mb-3">📎</div>
              <p className="font-semibold text-slate-700 group-hover:text-indigo-700">Click to upload product label or barcode</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
              <input type="file" accept="image/*" className="hidden" onChange={() => setError('Image barcode scanning coming soon! Please use camera or manual entry for now.')} />
            </label>
            <p className="text-center text-xs text-slate-400 mt-4">Tip: For best results, scan barcodes using the camera option</p>
          </div>
        )}

        {/* MANUAL MODE */}
        {mode === 'manual' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <form onSubmit={handleSearch}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search by product name</label>
              <div className="flex gap-2">
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Coca Cola, Oreo, Maggi..."
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                  Search
                </button>
              </div>
            </form>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or</span></div></div>
            <form onSubmit={handleManualBarcode}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Enter barcode number</label>
              <div className="flex gap-2">
                <input value={barcode} onChange={e => setBarcode(e.target.value)}
                  placeholder="e.g. 0049000028911"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                />
                <button type="submit" disabled={scanning} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                  {scanning ? '...' : 'Look Up'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-700">
          <strong>💡 Tips:</strong> EAN-13, UPC-A, and QR codes are all supported. Make sure the barcode is well-lit and not blurry for best results.
        </div>
      </div>
    </div>
  );
}

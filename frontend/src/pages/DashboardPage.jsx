import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, saveProduct, removeSavedProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const SCORE_COLORS = (s) => s <= 3 ? 'text-green-600 bg-green-50' : s <= 5.5 ? 'text-yellow-600 bg-yellow-50' : s <= 7.5 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Your personal product awareness dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Products Scanned', value: data?.scanHistory?.length || 0, icon: '📷' },
            { label: 'Products Saved', value: data?.savedProducts?.length || 0, icon: '🔖' },
            { label: 'Account', value: 'Active', icon: '✅' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Preferences quick edit */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-2">Your Profile</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">📧 {user?.email}</span>
            <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-full font-medium">🥗 Diet: {user?.preferences?.diet || 'none'}</span>
            {user?.preferences?.avoidHighSugar && <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full font-medium">🚫 High Sugar</span>}
            {user?.preferences?.avoidHighSodium && <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full font-medium">🚫 High Sodium</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 mb-6 w-fit">
          {[['history', '📷 Scan History'], ['saved', '🔖 Saved Products']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {!data?.scanHistory?.length ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                <div className="text-5xl mb-3">📷</div>
                <h3 className="font-bold text-slate-700 mb-2">No scans yet</h3>
                <p className="text-slate-400 text-sm mb-5">Scan a product to see it here</p>
                <Link to="/scan" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">Scan a Product</Link>
              </div>
            ) : data.scanHistory.map((item, i) => item.product && (
              <Link key={i} to={`/product/${item.product._id}`} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                  {item.product.image ? <img src={item.product.image} className="w-10 h-10 object-contain" alt="" /> : <span className="text-xl">🛍️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">{item.product.productName}</p>
                  <p className="text-xs text-slate-400">{item.product.category} · {item.scannedAt ? new Date(item.scannedAt).toLocaleDateString() : ''}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${SCORE_COLORS(item.product.concernScore || 0)}`}>
                  {item.product.concernScore?.toFixed(1)}/10
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Saved products */}
        {activeTab === 'saved' && (
          !data?.savedProducts?.length ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <div className="text-5xl mb-3">🔖</div>
              <h3 className="font-bold text-slate-700 mb-2">No saved products</h3>
              <p className="text-slate-400 text-sm mb-5">Save products from their analysis page</p>
              <Link to="/search" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.savedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}

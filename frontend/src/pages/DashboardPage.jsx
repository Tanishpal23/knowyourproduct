import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

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
    <div className="min-h-screen bg-[var(--background)] page-pad">
      <div className="page-shell page-shell--lg space-y-8" aria-busy="true">
        <div className="h-10 w-72 shimmer rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 shimmer rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  const SCORE_COLORS = (s) => s <= 3 ? 'text-green-700 bg-green-50' : s <= 5.5 ? 'text-yellow-700 bg-yellow-50' : s <= 7.5 ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50';

  return (
    <div className="min-h-screen bg-[var(--background)] page-pad">
      <div className="page-shell page-shell--lg">
        <div className="mb-10 fade-in-up">
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="page-subtitle">Your personal product awareness dashboard</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-grid">
          {[
            { label: 'Products Scanned', value: data?.scanHistory?.length || 0, icon: '📷' },
            { label: 'Products Saved', value: data?.savedProducts?.length || 0, icon: '🔖' },
            { label: 'Account', value: 'Active', icon: '✅' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center card-hover">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
          <h3 className="font-bold text-slate-800 mb-4">Your Profile</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-full font-medium break-all">📧 {user?.email}</span>
            <span className="px-3 py-2 bg-slate-50 text-slate-700 rounded-full font-medium">🥗 Diet: {user?.preferences?.diet || 'none'}</span>
            {user?.preferences?.avoidHighSugar && <span className="px-3 py-2 bg-red-50 text-red-600 rounded-full font-medium">High Sugar</span>}
            {user?.preferences?.avoidHighSodium && <span className="px-3 py-2 bg-orange-50 text-orange-600 rounded-full font-medium">High Sodium</span>}
          </div>
        </div>

        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 mb-6 w-full sm:w-fit overflow-x-auto">
          {[['history', 'Scan History'], ['saved', 'Saved Products']].map(([tab, label]) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-5 py-2.5 min-h-11 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'history' && (
          <div className="space-y-3">
            {!data?.scanHistory?.length ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 px-6">
                <div className="text-5xl mb-4">📷</div>
                <h3 className="font-bold text-slate-700 mb-2">No scans yet</h3>
                <p className="text-slate-400 text-sm mb-6">Scan a product to see it here</p>
                <Link to="/scan" className="btn-primary">Scan a Product</Link>
              </div>
            ) : data.scanHistory.map((item, i) => item.product && (
              <Link key={i} to={`/product/${item.product._id}`} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                  {item.product.image ? <img src={item.product.image} className="w-10 h-10 object-contain" alt="" /> : <span className="text-xl">🛍️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors duration-200 truncate">{item.product.productName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.product.category} · {item.scannedAt ? new Date(item.scannedAt).toLocaleDateString() : ''}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${SCORE_COLORS(item.product.concernScore || 0)}`}>
                  {item.product.concernScore?.toFixed(1)}/10
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          !data?.savedProducts?.length ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 px-6">
              <div className="text-5xl mb-4">🔖</div>
              <h3 className="font-bold text-slate-700 mb-2">No saved products</h3>
              <p className="text-slate-400 text-sm mb-6">Save products from their analysis page</p>
              <Link to="/search" className="btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-grid">
              {data.savedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}

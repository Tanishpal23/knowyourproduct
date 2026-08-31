import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts, getAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Beverages', 'Snacks & Cookies', 'Snacks & Chips', 'Instant Noodles', 'Juices & Beverages', 'Breakfast & Grains'];

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(params.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem('kyp_recent') || '[]'));
  const [category, setCategory] = useState('All');

  const doSearch = async (q, cat) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const catParam = cat && cat !== 'All' ? cat : undefined;
      const res = q
        ? await searchProducts({ q, ...(catParam && { category: catParam }) })
        : await getAllProducts();
      setResults(res.data.products || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  useEffect(() => {
    const q = params.get('q');
    if (q) { setQuery(q); doSearch(q, 'All'); }
    else doSearch('', 'All');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return doSearch('', category);
    const recent = [query, ...recentSearches.filter(r => r !== query)].slice(0, 6);
    setRecentSearches(recent);
    localStorage.setItem('kyp_recent', JSON.stringify(recent));
    navigate(`/search?q=${encodeURIComponent(query)}`);
    doSearch(query, category);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Search Products</h1>
          <p className="text-slate-500">Find any product to get a full ingredient & nutrition analysis</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">🔍</div>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search product name, brand, or category..."
              className="w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white shadow-sm transition-all"
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-4 rounded-2xl transition-colors shadow-sm">
            Search
          </button>
        </form>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); doSearch(query, cat); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Recent searches */}
        {!hasSearched && recentSearches.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Recent Searches</p>
            <div className="flex gap-2 flex-wrap">
              {recentSearches.map(r => (
                <button key={r} onClick={() => { setQuery(r); doSearch(r, category); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  🕐 {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        ) : hasSearched ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 text-sm mb-6">We couldn't find "{query}". Try a different search term.</p>
            <button onClick={() => { setQuery(''); doSearch('', 'All'); }}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Browse All Products
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

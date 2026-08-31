import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts, getAllProducts } from '../services/api';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

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
    <div className="min-h-screen bg-[var(--background)] page-pad">
      <div className="page-shell">
        <div className="text-center mb-10 sm:mb-12 fade-in-up">
          <h1 className="page-title">Search Products</h1>
          <p className="page-subtitle mx-auto">Find any product to get a full ingredient and nutrition analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative min-w-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400" aria-hidden="true">🔍</div>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search product name, brand, or category..."
              aria-label="Search products"
              className="input-ring w-full pl-11 pr-4 shadow-sm"
            />
          </div>
          <button type="submit" className="btn-primary sm:px-8">
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap mb-8 -mx-1 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} type="button" onClick={() => { setCategory(cat); doSearch(query, cat); }}
              className={`px-3.5 py-2 min-h-10 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${category === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:-translate-y-px'}`}>
              {cat}
            </button>
          ))}
        </div>

        {!hasSearched && recentSearches.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Recent Searches</p>
            <div className="flex gap-2 flex-wrap">
              {recentSearches.map(r => (
                <button key={r} type="button" onClick={() => { setQuery(r); doSearch(r, category); }}
                  className="px-3.5 py-2 min-h-10 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200">
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-5">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-grid">
              {results.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        ) : hasSearched ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-100 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">We couldn't find "{query}". Try a different search term or browse the full catalogue.</p>
            <button type="button" onClick={() => { setQuery(''); doSearch('', 'All'); }}
              className="btn-primary">
              Browse All Products
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

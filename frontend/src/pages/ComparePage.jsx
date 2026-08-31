import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, compareProducts } from '../services/api';

const NUTRITION_FIELDS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'totalSugar', label: 'Total Sugar', unit: 'g' },
  { key: 'addedSugar', label: 'Added Sugar', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
];

function scoreBg(score) {
  if (score <= 3) return 'bg-green-100 text-green-700';
  if (score <= 5.5) return 'bg-yellow-100 text-yellow-700';
  if (score <= 7.5) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}

export default function ComparePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState([null, null]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllProducts().then(res => setAllProducts(res.data.products || []));
  }, []);

  const handleSelect = (idx, id) => {
    const updated = [...selected];
    updated[idx] = id || null;
    setSelected(updated);
    setComparison(null);
  };

  const handleCompare = async () => {
    if (!selected[0] || !selected[1]) return setError('Please select two products');
    if (selected[0] === selected[1]) return setError('Please select two different products');
    setLoading(true); setError('');
    try {
      const res = await compareProducts(selected);
      setComparison(res.data);
    } catch {
      setError('Could not compare products. Please try again.');
    }
    setLoading(false);
  };

  const isBetter = (p1, p2, key) => {
    const v1 = p1?.nutrition?.[key]; const v2 = p2?.nutrition?.[key];
    if (v1 === undefined || v2 === undefined) return null;
    const higherIsBetter = ['protein', 'fiber'];
    return higherIsBetter.includes(key) ? v1 > v2 : v1 < v2;
  };

  const products = comparison?.products || [];

  return (
    <div className="min-h-screen bg-[var(--background)] page-pad">
      <div className="page-shell page-shell--lg">
        <div className="text-center mb-10 sm:mb-12 fade-in-up">
          <h1 className="page-title">Compare Products</h1>
          <p className="page-subtitle mx-auto">Select two products to compare their scores, nutrition, and ingredients.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[0, 1].map(idx => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm font-bold text-slate-500 mb-3">Product {idx + 1}</p>
              <select value={selected[idx] || ''} onChange={e => handleSelect(idx, e.target.value)}
                className="input-ring w-full">
                <option value="">Select a product...</option>
                {allProducts.map(p => <option key={p._id} value={p._id}>{p.productName} — {p.brand}</option>)}
              </select>
            </div>
          ))}
        </div>

        {error && <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100" role="alert">{error}</div>}

        <div className="text-center mb-10">
          <button type="button" onClick={handleCompare} disabled={loading || !selected[0] || !selected[1]}
            className="btn-primary px-8">
            {loading ? 'Comparing…' : 'Compare Now'}
          </button>
        </div>

        {comparison && products.length === 2 && (
          <div className="space-y-6 fade-in-up">
            {comparison.betterChoiceName && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-3xl p-6 sm:p-8 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-black text-slate-800">Better Overall Choice</h3>
                <p className="text-lg font-bold text-green-700 mt-2">{comparison.betterChoiceName}</p>
                <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">Based on lower overall concern score. Consider your specific dietary needs when making your final choice.</p>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h3 className="font-black text-slate-800 mb-6 text-lg">Overall Concern Score</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((p) => (
                  <div key={p._id} className="text-center">
                    <Link to={`/product/${p._id}`} className="font-bold text-slate-700 text-sm hover:text-indigo-600 transition-colors duration-200 block mb-3 break-words">{p.productName}</Link>
                    <div className={`text-4xl font-black rounded-2xl py-5 ${scoreBg(p.concernScore)}`}>{p.concernScore?.toFixed(1)}<span className="text-lg font-normal">/10</span></div>
                    {comparison.betterChoice?.toString() === p._id?.toString() && (
                      <div className="mt-3 text-xs bg-green-100 text-green-700 rounded-full px-3 py-1.5 inline-block font-semibold">Better Choice</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h3 className="font-black text-slate-800 mb-5 text-lg">Nutrition Comparison</h3>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm min-w-[28rem]">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide pb-3 pr-4">Nutrient</th>
                      {products.map(p => <th key={p._id} className="text-center pb-3 px-3 text-xs font-bold text-slate-800 min-w-24">{p.productName.split(' ').slice(0,2).join(' ')}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {NUTRITION_FIELDS.map(f => {
                      const vals = products.map(p => p.nutrition?.[f.key]);
                      const better0 = isBetter(products[0], products[1], f.key);
                      return (
                        <tr key={f.key} className="hover:bg-slate-50">
                          <td className="py-3 pr-4 text-slate-600 font-medium">{f.label}</td>
                          {products.map((p, i) => {
                            const myBetter = i === 0 ? better0 : better0 === null ? null : !better0;
                            return (
                              <td key={p._id} className={`py-3 px-3 text-center font-semibold ${myBetter === true ? 'text-green-600' : myBetter === false ? 'text-red-500' : 'text-slate-700'}`}>
                                {vals[i] !== undefined ? `${vals[i]}${f.unit}` : '—'}
                                {myBetter === true && ' ✓'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4">✓ indicates better value. Protein and Fiber: higher is better. All others: lower is better.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h3 className="font-black text-slate-800 mb-5 text-lg">Allergen Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p._id}>
                    <p className="text-sm font-bold text-slate-600 mb-3 break-words">{p.productName.split(' ').slice(0,2).join(' ')}</p>
                    {p.allergens?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {p.allergens.map(a => <span key={a} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">{a}</span>)}
                      </div>
                    ) : <span className="text-xs text-green-600 font-medium">No major allergens listed</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

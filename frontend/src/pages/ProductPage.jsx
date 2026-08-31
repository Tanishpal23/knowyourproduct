import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, saveProduct, removeSavedProduct, recordScan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ScoreCircle from '../components/ScoreCircle';
import IngredientCard from '../components/IngredientCard';
import NutritionBar from '../components/NutritionBar';

const PROCESSING_LABELS = {
  'minimally-processed': { label: 'Minimally Processed', color: 'bg-green-100 text-green-700', icon: '🌿' },
  'processed': { label: 'Processed', color: 'bg-yellow-100 text-yellow-700', icon: '🏭' },
  'highly-processed': { label: 'Highly Processed', color: 'bg-red-100 text-red-700', icon: '⚠️' },
  'unknown': { label: 'Processing Unknown', color: 'bg-slate-100 text-slate-600', icon: '❓' },
};

const ALLERGEN_ICONS = { Milk: '🥛', Soy: '🌱', Wheat: '🌾', Peanuts: '🥜', 'Tree nuts': '🌰', Eggs: '🥚', Fish: '🐟', Shellfish: '🦐' };

function ScoreBreakdownModal({ breakdown, onClose }) {
  if (!breakdown) return null;
  const items = [
    { label: 'Nutrition Quality', score: breakdown.nutritionScore, weight: '40%', desc: 'Sugar, sodium, fat, fiber, protein' },
    { label: 'Ingredient Composition', score: breakdown.ingredientScore, weight: '30%', desc: 'Naturalness of ingredients' },
    { label: 'Additives', score: breakdown.additiveScore, weight: '20%', desc: 'Artificial colors, preservatives, etc.' },
    { label: 'Allergen Risk', score: breakdown.allergenRisk, weight: '5%', desc: 'Major allergen presence' },
    { label: 'Processing Level', score: breakdown.processingScore, weight: '5%', desc: 'Minimal to highly processed' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="score-modal-title">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 id="score-modal-title" className="text-lg font-black text-slate-900 leading-snug">How Was This Score Calculated?</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none min-w-11 min-h-11 rounded-xl hover:bg-slate-50 transition-colors duration-200" aria-label="Close">✕</button>
        </div>
        <p className="text-sm text-slate-500 mb-6">The KnowYourProduct Concern Score combines multiple factors. Higher score = higher concern.</p>
        <div className="space-y-4 mb-6">
          {items.map(item => item.score !== undefined && (
            <div key={item.label}>
              <div className="flex justify-between mb-1.5 gap-3">
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400">Weight: {item.weight}</span>
                  <span className="text-sm font-bold text-slate-800">{item.score?.toFixed(1)}/10</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(item.score / 10) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-800 border border-amber-100 leading-relaxed">
          This score is for consumer awareness only and should not be interpreted as medical advice. Scores reflect general patterns and may not account for individual health conditions.
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [servingToggle, setServingToggle] = useState('serving');
  const [sortIngredients, setSortIngredients] = useState('concern');

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => {
        setProduct(res.data.product);
        if (user) recordScan(id).catch(() => {});
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      if (saved) { await removeSavedProduct(id); setSaved(false); }
      else { await saveProduct(id); setSaved(true); }
    } catch {}
  };

  if (loading) return (
    <div className="bg-[var(--background)] min-h-screen page-pad">
      <div className="page-shell page-shell--lg space-y-6" aria-busy="true" aria-label="Loading product">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-56 h-56 shimmer rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-3 w-24 shimmer rounded-full" />
            <div className="h-8 w-3/4 shimmer rounded-full" />
            <div className="h-4 w-1/3 shimmer rounded-full" />
            <div className="h-10 w-40 shimmer rounded-xl" />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-8 h-64 shimmer" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] px-5">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find this product in our database.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate(-1)} className="btn-ghost">Go Back</button>
          <Link to="/search" className="btn-primary">Search Products</Link>
        </div>
      </div>
    </div>
  );

  const { productName, brand, category, image, servingSize, barcode, country, concernScore, scoreBreakdown,
    keyWarnings = [], positives = [], nutrition, ingredients = [], allergens = [], processingLevel, analysisNotes } = product;

  const procInfo = PROCESSING_LABELS[processingLevel] || PROCESSING_LABELS.unknown;

  const sortedIngredients = [...ingredients].sort((a, b) => {
    if (sortIngredients === 'concern') {
      const order = { significant: 0, high: 1, moderate: 2, low: 3 };
      return (order[a.concernLevel] ?? 4) - (order[b.concernLevel] ?? 4);
    }
    return a.name.localeCompare(b.name);
  });

  const NUTRITION_KEYS = ['calories', 'totalFat', 'saturatedFat', 'transFat', 'carbohydrates', 'totalSugar', 'addedSugar', 'protein', 'fiber', 'sodium'];

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {showBreakdown && <ScoreBreakdownModal breakdown={scoreBreakdown} onClose={() => setShowBreakdown(false)} />}

      <div className="bg-white border-b border-slate-100">
        <div className="page-shell page-shell--lg py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            <div className="w-full md:w-56 h-56 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100">
              {image
                ? <img src={image} alt={productName} className="h-40 w-auto max-w-[85%] object-contain"
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                  />
                : null}
              <span className="text-5xl" style={{ display: image ? 'none' : 'block' }} aria-hidden="true">🛍️</span>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">{category}</span>
                  <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-black text-slate-900 mt-1 leading-tight break-words">{productName}</h1>
                  <p className="text-slate-500 text-sm mt-2">{brand}{country ? ` · ${country}` : ''}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleSave}
                    className={`px-4 py-2.5 min-h-11 rounded-[10px] text-sm font-semibold border transition-all duration-200 ${saved ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'}`}>
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <Link to="/compare" className="px-4 py-2.5 min-h-11 inline-flex items-center rounded-[10px] text-sm font-semibold border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                    Compare
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                {servingSize && <span>Serving {servingSize}</span>}
                {barcode && <span className="font-mono">Barcode {barcode}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell page-shell--lg py-8 sm:py-10 lg:py-12 space-y-8">

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 lg:p-10">
          <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-8">KnowYourProduct Concern Score</h2>
          <div className="flex flex-col items-center mb-8">
            <ScoreCircle score={concernScore || 0} size={200} />
          </div>
          <div className="text-center mb-8">
            <button onClick={() => setShowBreakdown(true)} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 underline underline-offset-2 transition-colors duration-200">
              How was this calculated? →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyWarnings.length > 0 && (
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <h3 className="text-sm font-black text-orange-700 mb-4 uppercase tracking-wide">Key Concerns</h3>
                <ul className="space-y-2.5">
                  {keyWarnings.map(w => <li key={w} className="flex items-start gap-2 text-sm text-orange-800 leading-relaxed"><span className="mt-0.5 flex-shrink-0">•</span>{w}</li>)}
                </ul>
              </div>
            )}
            {positives.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <h3 className="text-sm font-black text-green-700 mb-4 uppercase tracking-wide">Positive Attributes</h3>
                <ul className="space-y-2.5">
                  {positives.map(p => <li key={p} className="flex items-start gap-2 text-sm text-green-800 leading-relaxed"><span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
          {analysisNotes && (
            <div className="mt-6 p-5 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 leading-relaxed">{analysisNotes}</p>
            </div>
          )}
        </div>

        {nutrition && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-xl font-black text-slate-900">Nutrition Facts</h2>
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs self-start">
                {['serving', '100g'].map(t => (
                  <button key={t} type="button" onClick={() => setServingToggle(t)}
                    className={`px-3 py-2 min-h-9 rounded-md font-semibold transition-all duration-200 ${servingToggle === t ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>
                    Per {t === 'serving' ? 'Serving' : '100g'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {NUTRITION_KEYS.map(key => {
                const raw = nutrition[key];
                if (raw === undefined || raw === null) return null;
                const val = servingToggle === '100g' && nutrition.servingSizeG
                  ? Math.round((raw / nutrition.servingSizeG) * 100 * 10) / 10
                  : raw;
                return <NutritionBar key={key} nutrient={key} value={val} />;
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">What's Inside?</h2>
              <p className="text-sm text-slate-500 mt-1">{ingredients.length} ingredients found. Tap any card to learn more.</p>
            </div>
            <select value={sortIngredients} onChange={e => setSortIngredients(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 min-h-11 bg-white outline-none text-slate-600 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200">
              <option value="concern">Sort by concern</option>
              <option value="name">Sort by name</option>
            </select>
          </div>
          <div className="space-y-3">
            {sortedIngredients.map((ing, i) => <IngredientCard key={i} ingredient={ing} />)}
          </div>
        </div>

        {allergens.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="text-xl font-black text-slate-900 mb-5">Allergen Information</h2>
            <div className="flex flex-wrap gap-3">
              {allergens.map(a => (
                <div key={a} className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-2.5">
                  <span>{ALLERGEN_ICONS[a] || '⚠️'}</span>
                  <span className="font-semibold text-sm">{a}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">Always check the original product label for allergen declarations. Manufacturing environments may also process other allergens.</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-900 mb-5">Processing Level</h2>
          <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold ${procInfo.color}`}>
            <span className="text-xl">{procInfo.icon}</span>
            <span>{procInfo.label}</span>
          </div>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed max-w-2xl">Processing level indicates how much industrial transformation this product has undergone. Minimally processed foods are generally closer to their natural state.</p>
        </div>

        {scoreBreakdown && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <h2 className="text-xl font-black text-slate-900">Score Breakdown</h2>
              <button onClick={() => setShowBreakdown(true)} className="text-sm text-indigo-600 font-semibold hover:underline">Full methodology</button>
            </div>
            <div className="space-y-4">
              {[
                ['Nutrition', scoreBreakdown.nutritionScore, '40%'],
                ['Ingredients', scoreBreakdown.ingredientScore, '30%'],
                ['Additives', scoreBreakdown.additiveScore, '20%'],
                ['Allergen Risk', scoreBreakdown.allergenRisk, '5%'],
                ['Processing', scoreBreakdown.processingScore, '5%'],
              ].map(([label, score, weight]) => score !== undefined && (
                <div key={label} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-20 sm:w-28 text-xs sm:text-sm text-slate-600 font-medium flex-shrink-0">{label}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-0">
                    <div className="h-full bg-indigo-400 rounded-full transition-all duration-700" style={{ width: `${(score / 10) * 100}%` }} />
                  </div>
                  <div className="w-12 sm:w-14 text-right text-sm font-bold text-slate-700 flex-shrink-0">{score?.toFixed(1)}</div>
                  <div className="w-8 text-right text-xs text-slate-400 hidden sm:block">{weight}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs sm:text-sm text-amber-800 leading-relaxed">
          <strong>Educational Disclaimer:</strong> The KnowYourProduct Concern Score is intended for consumer awareness and education only. It is not a medical diagnosis, nutritional recommendation, or regulatory assessment. Individual health responses to ingredients can vary. Always read the original product label and consult a healthcare professional for health-related decisions.
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const FAQ_ITEMS = [
  { q: 'How does the concern score work?', a: 'Our KnowYourProduct Concern Score (0–10) combines five factors: nutrition quality, ingredient composition, additive count, allergen presence, and processing level. Every factor is visible in the score breakdown so you can see exactly how it was calculated.' },
  { q: 'Can I scan any product?', a: 'You can scan any barcode or QR code. Our database now covers 24+ popular products across beverages, snacks, noodles, and cereals — and we\'re growing. If a product isn\'t found, you can search by name.' },
  { q: 'Is the score medical advice?', a: 'No. The concern score is for consumer awareness and education only. It should never replace professional medical advice, diagnosis, or treatment.' },
  { q: 'Where does product information come from?', a: 'Data comes from product labels, public food databases (Open Food Facts), and peer-reviewed ingredient research. We cite evidence levels — "high", "moderate", "limited" — to be fully transparent.' },
  { q: 'Why can two similar products have very different scores?', a: 'Small differences in sodium, added sugar, additive types, or processing level can move the score significantly. The score reflects the whole product holistically, not a single ingredient.' },
];

const FEATURES = [
  { icon: '🔬', title: 'Ingredient Analysis', desc: 'Every ingredient explained in plain English — what it is, why it\'s used, and what the science says.' },
  { icon: '🍎', title: 'Nutrition Dashboard', desc: 'Visual nutrition breakdown with daily value context so you see what\'s high or low at a glance.' },
  { icon: '⚠️', title: 'Additive Detection', desc: 'Flags artificial colors, preservatives, sweeteners, and controversial additives automatically.' },
  { icon: '🌾', title: 'Allergen Alerts', desc: 'Detects 8 major allergens and personalises warnings based on your saved dietary preferences.' },
  { icon: '🏭', title: 'Processing Level', desc: 'Products classified as minimally processed, processed, or highly processed using NOVA criteria.' },
  { icon: '⚡', title: 'Concern Score', desc: 'A transparent 0–10 score with a detailed breakdown — you always know how it was calculated.' },
];

const MOCK_PRODUCT = {
  name: 'Example Fruit Drink', brand: 'Generic Brand', score: 7.2,
  warnings: ['High added sugar (28g per serving)', 'High sodium (420mg)', 'Contains artificial flavouring'],
  positives: ['No trans fat listed', 'Contains Vitamin C'],
};

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await searchProducts({ q: query });
      setResults(res.data.products || []);
    } catch { setResults([]); }
    setSearching(false);
  };

  return (
    <div className="overflow-x-clip">

      <section className="hero-gradient min-h-[min(92vh,900px)] flex items-center relative overflow-hidden">
        <div className="absolute top-24 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full page-shell py-16 sm:py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-white/80 mb-8 backdrop-blur-sm fade-in-up">
            <span className="pulse-dot w-2 h-2 bg-green-400 rounded-full inline-block flex-shrink-0" />
            Transparent consumer awareness — 24+ products analysed
          </div>

          <h1 className="text-[clamp(2rem,6vw,5rem)] font-black text-white mb-6 leading-[1.1] tracking-tight fade-in-up" style={{ animationDelay: '0.08s' }}>
            Know What You're<br />
            <span className="gradient-text">Really Buying.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up" style={{ animationDelay: '0.16s' }}>
            Scan any product and understand what's inside — in simple language. Get a full ingredient breakdown, nutrition analysis, and a transparent concern score.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16 sm:mb-20 lg:mb-24 fade-in-up" style={{ animationDelay: '0.24s' }}>
            <Link to="/scan"
              className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-7 py-3.5 min-h-12 rounded-[10px] text-base transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-indigo-900/40">
              Scan a Product
            </Link>
            <Link to="/search"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-7 py-3.5 min-h-12 rounded-[10px] text-base transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5">
              Browse All Products
            </Link>
          </div>

          
          <div className="max-w-lg mx-auto mt-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 fade-in-up" style={{ animationDelay: '0.32s' }}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search any product... (e.g. Oreo, Maggi)"
                aria-label="Search products"
                className="flex-1 min-w-0 bg-white/15 text-white placeholder-white/50 border border-white/25 rounded-xl px-4 py-3 min-h-12 text-sm outline-none focus:bg-white/25 focus:border-white/50 transition-all duration-200"
              />
              <button type="submit" disabled={searching}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-3 min-h-12 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-60 sm:flex-shrink-0">
                {searching ? 'Searching…' : 'Search'}
              </button>
            </form>
            <p className="text-white/40 text-xs mt-3 text-center">Try: Coca Cola · Oreo · Maggi · KitKat</p>
          </div>

          {results.length > 0 && (
            <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid fade-in text-left">
              {results.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border-b border-slate-100 py-10 sm:py-12">
        <div className="page-shell">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '24+', label: 'Products Analysed' },
              { value: '100%', label: 'Transparent Scoring' },
              { value: '5', label: 'Score Factors' },
              { value: 'Free', label: 'Always Free' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-black text-indigo-600 tabular-nums">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
                Why KnowYourProduct?
              </span>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-slate-900 mb-6 leading-tight">
                You deserve to know what's in your food.
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-[15px] sm:text-base max-w-xl">
                <p>Product labels are legally required — but they're not designed to be <em>understood</em>. Ingredient names like <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">"Carrageenan"</span>, <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">"Sodium Benzoate"</span>, or <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">"TBHQ"</span> mean nothing to most people.</p>
                <p>We believe every consumer has the right to understand what they're putting into their body — without needing a chemistry degree.</p>
                <p className="font-semibold text-slate-800">KnowYourProduct translates the label into plain English.</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-8 sm:gap-10">
                <div><div className="text-3xl sm:text-4xl font-black text-indigo-600 tabular-nums">24+</div><div className="text-xs text-slate-500 mt-1">Products in database</div></div>
                <div><div className="text-3xl sm:text-4xl font-black text-indigo-600">100%</div><div className="text-xs text-slate-500 mt-1">Transparent scoring</div></div>
                <div><div className="text-3xl sm:text-4xl font-black text-indigo-600">Free</div><div className="text-xs text-slate-500 mt-1">Always free to use</div></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-grid">
              {FEATURES.map(f => (
                <div key={f.title}
                  className="bg-slate-50 rounded-2xl p-6 hover:bg-indigo-50 transition-all duration-200 group card-hover border border-transparent hover:border-indigo-100">
                  <div className="text-3xl mb-4" aria-hidden="true">{f.icon}</div>
                  <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-indigo-700 transition-colors duration-200">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-indigo-50/50">
        <div className="page-shell text-center">
          <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
            Simple as 1-2-3
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">From barcode to plain-English analysis in three steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[16.7%] right-[16.7%] h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200 pointer-events-none" />
            {[
              { step: '01', icon: '📷', title: 'Scan or Search', desc: 'Use your camera to scan a barcode, or simply search by product name from our growing database.' },
              { step: '02', icon: '🔬', title: 'We Analyse', desc: 'Every ingredient, nutrition value, additive, allergen, and processing method is examined in detail.' },
              { step: '03', icon: '💡', title: 'You Understand', desc: 'Get a clear concern score, plain-English ingredient explanations, and a balanced product summary.' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-3xl mx-auto mb-6 transition-colors duration-200">{item.icon}</div>
                  <div className="text-xs font-black text-indigo-400 mb-2 tracking-widest">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="page-shell page-shell--lg">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
              See It In Action
            </span>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-slate-900">Example Product Analysis</h2>
          </div>
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl border border-indigo-900/50">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0 text-center">
                <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center text-5xl mb-3 border border-white/10">🥤</div>
                <p className="font-bold text-white text-sm">{MOCK_PRODUCT.name}</p>
                <p className="text-slate-400 text-xs mt-1">{MOCK_PRODUCT.brand}</p>
              </div>
              <div className="flex-1 w-full space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-black text-orange-400 tabular-nums">{MOCK_PRODUCT.score}</div>
                    <div className="text-xs text-slate-400 mt-1">/10 Concern Score</div>
                  </div>
                  <div className="hidden sm:block flex-1 h-px bg-white/10" />
                  <div className="text-sm bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full font-semibold border border-orange-500/30 self-center">
                    HIGH CONCERN
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Key Concerns</p>
                    {MOCK_PRODUCT.warnings.map(w => <div key={w} className="flex items-start gap-2 text-sm text-slate-300"><span className="text-orange-400 mt-0.5 flex-shrink-0">▸</span>{w}</div>)}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Positives</p>
                    {MOCK_PRODUCT.positives.map(p => <div key={p} className="flex items-start gap-2 text-sm text-slate-300"><span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{p}</div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link to="/search"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-7 py-3 min-h-12 rounded-[10px] transition-all duration-200 hover:-translate-y-0.5">
                Analyse a Real Product →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="page-shell page-shell--md">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full mb-5">Questions</span>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${openFaq === i ? 'border-indigo-200 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 sm:px-6 py-4 min-h-14 flex justify-between items-center gap-4 group">
                  <span className={`font-semibold text-sm sm:text-[15px] transition-colors duration-200 ${openFaq === i ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-600'}`}>{item.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 text-sm font-bold ${openFaq === i ? 'bg-indigo-100 text-indigo-600 rotate-45' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 sm:px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4 fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600" />
        <div className="relative z-10 page-shell page-shell--md">
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black mb-4 leading-tight">Don't just read the label. Understand it.</h2>
          <p className="text-indigo-100 text-base sm:text-lg mb-10">Join thousands of consumers making more informed choices every day.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/scan"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-7 py-3.5 min-h-12 rounded-[10px] text-base hover:bg-indigo-50 transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-indigo-900/30">
              Scan Your Product — Free
            </Link>
            <Link to="/search"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-7 py-3.5 min-h-12 rounded-[10px] text-base transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm">
              Browse Products →
            </Link>
          </div>
          <p className="mt-6 text-indigo-200 text-sm">No account required to scan or search.</p>
        </div>
      </section>

      <div className="bg-amber-50 border-t border-amber-200 py-5">
        <div className="page-shell text-center text-xs sm:text-sm text-amber-800 leading-relaxed">
          <strong>Educational Disclaimer:</strong> KnowYourProduct provides information for consumer awareness. Concern scores are not medical diagnoses or medical advice. Always consult a qualified healthcare professional for health-related decisions.
        </div>
      </div>
    </div>
  );
}

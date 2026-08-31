import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchProducts, getAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const FAQ_ITEMS = [
  { q: 'How does the concern score work?', a: 'Our KnowYourProduct Concern Score (0–10) is calculated from five factors: nutrition quality, ingredient composition, additive count, allergen presence, and processing level. Each factor is weighted and combined to give a transparent overall score.' },
  { q: 'Can I scan any product?', a: 'You can scan any barcode or QR code. Our database is growing. If a product isn\'t found, you can search by name or submit a request to add it.' },
  { q: 'Is the score medical advice?', a: 'No. The concern score is purely for consumer awareness and education. It should never be used as a substitute for professional medical advice, diagnosis, or treatment.' },
  { q: 'Where does product information come from?', a: 'We source data from product labels, public food databases, and peer-reviewed ingredient research. We cite evidence levels (high/moderate/limited/uncertain) to be transparent.' },
  { q: 'Why can two similar products have different scores?', a: 'Small differences in ingredients, sodium content, additive types, or sugar quantity can significantly affect the score. The score reflects the whole product, not just one ingredient.' },
];

const FEATURES = [
  { icon: '🔬', title: 'Ingredient Analysis', desc: 'Every ingredient explained in plain English — what it is, why it\'s used, and what the evidence says.' },
  { icon: '🍎', title: 'Nutrition Dashboard', desc: 'Visual nutrition breakdown with daily value context so you immediately see what\'s high or low.' },
  { icon: '⚠️', title: 'Additive Detection', desc: 'We flag artificial colors, preservatives, sweeteners, and controversial additives automatically.' },
  { icon: '🌾', title: 'Allergen Alerts', desc: 'Detects 8 major allergens and personalises warnings based on your preferences.' },
  { icon: '🏭', title: 'Processing Level', desc: 'Products are classified as minimally processed, processed, or highly processed.' },
  { icon: '⚡', title: 'Concern Score', desc: 'A transparent 0–10 score with a full breakdown so you know exactly how it was calculated.' },
];

const MOCK_PRODUCT = {
  name: 'Example Fruit Drink', brand: 'Generic Brand', score: 7.2,
  warnings: ['High added sugar (28g)', 'High sodium (420mg)', 'Contains artificial flavoring'],
  positives: ['No trans fat listed', 'Contains Vitamin C'],
};

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await searchProducts({ q: query });
      setResults(res.data.products || []);
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* HERO */}
      <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-white/80 mb-8 backdrop-blur-sm">
            <span className="pulse-dot w-2 h-2 bg-green-400 rounded-full inline-block" />
            Trusted consumer awareness platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Know What You're<br />
            <span className="gradient-text">Really Buying.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Scan any product and understand what's inside it — in simple language. Get an overall concern score, ingredient breakdown, and nutrition analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/scan" className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-900/40">
              📷 Scan Product
            </Link>
            <Link to="/search" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all backdrop-blur-sm">
              🔍 Search Product
            </Link>
          </div>

          {/* Hero scanner mock */}
          <div className="max-w-sm mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search any product..."
                className="flex-1 bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/30 transition-colors"
              />
              <button type="submit" disabled={searching} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-3 rounded-xl font-medium transition-colors">
                {searching ? '⏳' : '🔍'}
              </button>
            </form>
            <p className="text-white/50 text-xs mt-3 text-center">Try: "Coca Cola", "Oreo", "Maggi"</p>
          </div>

          {/* Quick results from hero search */}
          {results.length > 0 && (
            <div className="max-w-2xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Why KnowYourProduct?</span>
              <h2 className="text-4xl font-black text-slate-900 mt-3 mb-6 leading-tight">You deserve to know what's in your food.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>Product labels are legally required — but they're not designed to be understood. Ingredient names like <em>"Carrageenan"</em>, <em>"Sodium Benzoate"</em>, or <em>"TBHQ"</em> mean nothing to most people.</p>
                <p>We believe every consumer has the right to understand what they're putting into their body — without needing a chemistry degree.</p>
                <p className="font-semibold text-slate-800">KnowYourProduct translates the label into plain English.</p>
              </div>
              <div className="mt-8 flex gap-8">
                <div><div className="text-3xl font-black text-indigo-600">6+</div><div className="text-xs text-slate-500 mt-1">Products in database</div></div>
                <div><div className="text-3xl font-black text-indigo-600">100%</div><div className="text-xs text-slate-500 mt-1">Transparent scoring</div></div>
                <div><div className="text-3xl font-black text-indigo-600">Free</div><div className="text-xs text-slate-500 mt-1">Always free to use</div></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-slate-50 rounded-2xl p-5 hover:bg-indigo-50 transition-colors group">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Simple as 1-2-3</span>
          <h2 className="text-4xl font-black text-slate-900 mt-3 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📷', title: 'Scan or Search', desc: 'Use your camera to scan a barcode, upload a product label image, or simply search by product name.' },
              { step: '02', icon: '🔬', title: 'We Analyze', desc: 'Our system examines every ingredient, nutrition value, additive, allergen, and processing method.' },
              { step: '03', icon: '💡', title: 'You Understand', desc: 'Get a clear concern score, plain-English ingredient explanations, and a balanced summary of the product.' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm font-black text-indigo-300 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLE ANALYSIS PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">See It In Action</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3">Example Product Analysis</h2>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0 text-center">
                <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center text-5xl mb-3">🥤</div>
                <p className="font-bold">{MOCK_PRODUCT.name}</p>
                <p className="text-slate-400 text-sm">{MOCK_PRODUCT.brand}</p>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl font-black text-orange-400">{MOCK_PRODUCT.score}</div>
                    <div className="text-xs text-slate-400">/10 Concern Score</div>
                  </div>
                  <div className="flex-1 h-px bg-white/10" />
                  <div className="text-sm bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full font-semibold border border-orange-500/30">HIGH CONCERN</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    {MOCK_PRODUCT.warnings.map(w => <div key={w} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-orange-400 mt-0.5">⚠</span>{w}</div>)}
                  </div>
                  <div className="space-y-1">
                    {MOCK_PRODUCT.positives.map(p => <div key={p} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-green-400 mt-0.5">✓</span>{p}</div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/search" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Analyse a Real Product →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-4 flex justify-between items-center gap-4">
                  <span className="font-semibold text-slate-800 text-sm">{item.q}</span>
                  <span className={`text-slate-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-teal-600 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-4">Don't just read the label. Understand it.</h2>
          <p className="text-indigo-100 text-lg mb-8">Join thousands of consumers making more informed choices every day.</p>
          <Link to="/scan" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-indigo-50 transition-colors shadow-xl">
            📷 Scan Your Product — It's Free
          </Link>
          <p className="mt-4 text-indigo-200 text-sm">No account required to scan or search.</p>
        </div>
      </section>

      {/* Disclaimer banner */}
      <div className="bg-amber-50 border-t border-amber-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-amber-800 leading-relaxed">
          <strong>Educational Disclaimer:</strong> KnowYourProduct provides information for consumer awareness based on available product and ingredient data. Concern scores are not medical diagnoses or medical advice. Always consult a qualified healthcare professional for health-related decisions.
        </div>
      </div>
    </div>
  );
}

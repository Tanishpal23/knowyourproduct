import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01', icon: '📷', title: 'Scan or Search',
    details: [
      'Use your device camera to scan any barcode or QR code',
      'Upload a photo of the product label',
      'Search by product name or brand',
      'Enter a barcode number manually',
    ],
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    step: '02', icon: '🔬', title: 'We Analyse',
    details: [
      'Every ingredient is identified and explained in plain English',
      'Nutrition values are compared against daily reference values',
      'Additives, preservatives, and coloring agents are flagged',
      'Allergens are automatically detected',
      'Processing level is classified',
    ],
    color: 'from-violet-500 to-purple-600',
  },
  {
    step: '03', icon: '💡', title: 'You Understand',
    details: [
      'Get a transparent Concern Score from 0–10',
      'See a balanced list of warnings and positives',
      'Read simple "What is it / Why is it used / Why should I care?" for each ingredient',
      'Understand exactly how the score was calculated',
      'Compare products side-by-side',
    ],
    color: 'from-teal-500 to-emerald-600',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-4">How KnowYourProduct Works</h1>
          <p className="text-xl text-slate-300">Three simple steps from label to understanding.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
          {STEPS.map((s, i) => (
            <div key={s.step} className={`flex flex-col ${i % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-10 items-center`}>
              <div className={`flex-shrink-0 w-48 h-48 rounded-3xl bg-gradient-to-br ${s.color} flex flex-col items-center justify-center text-white shadow-xl`}>
                <div className="text-5xl mb-2">{s.icon}</div>
                <div className="text-xs font-black tracking-widest opacity-70">STEP {s.step}</div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900 mb-4">{s.title}</h2>
                <ul className="space-y-3">
                  {s.details.map(d => (
                    <li key={d} className="flex items-start gap-3 text-slate-600">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The scoring */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-10">The Concern Score</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Nutrition Quality', weight: '40%', desc: 'Sugar, sodium, fat, fiber, protein', icon: '🍎' },
              { label: 'Ingredients', weight: '30%', desc: 'Naturalness and number of ingredients', icon: '🧪' },
              { label: 'Additives', weight: '20%', desc: 'Colors, preservatives, sweeteners', icon: '⚗️' },
              { label: 'Allergen Risk', weight: '5%', desc: '8 major allergens', icon: '⚠️' },
              { label: 'Processing', weight: '5%', desc: 'Minimal to highly processed', icon: '🏭' },
            ].map(f => (
              <div key={f.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="text-lg font-black text-indigo-600">{f.weight}</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{f.label}</div>
                <div className="text-xs text-slate-500 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[['🟢', '0–3', 'Low Concern', 'bg-green-100 text-green-700'], ['🟡', '3–5.5', 'Moderate', 'bg-yellow-100 text-yellow-700'], ['🟠', '5.5–7.5', 'High Concern', 'bg-orange-100 text-orange-700'], ['🔴', '7.5–10', 'Significant', 'bg-red-100 text-red-700']].map(([e, r, l, c]) => (
                <div key={l} className={`rounded-xl py-3 px-2 ${c}`}>
                  <div className="text-2xl mb-1">{e}</div>
                  <div className="font-bold text-sm">{l}</div>
                  <div className="text-xs opacity-70">{r}/10</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to try it?</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/scan" className="bg-indigo-600 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-700 transition-colors">📷 Scan a Product</Link>
          <Link to="/search" className="border border-slate-200 text-slate-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-slate-50 transition-colors">🔍 Search</Link>
        </div>
      </section>
    </div>
  );
}

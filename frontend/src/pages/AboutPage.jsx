import { Link } from 'react-router-dom';

const VALUES = [
  { icon: '🔍', title: 'Transparency', desc: 'We show how every score is calculated. No black boxes, no hidden algorithms. You can see every factor that contributed to a product\'s rating.' },
  { icon: '📚', title: 'Education', desc: 'We don\'t scare you — we educate you. Every concern is backed by context: what is the ingredient, why is it there, and what does the evidence actually say.' },
  { icon: '♿', title: 'Accessibility', desc: 'Product labels are legal documents written for regulators, not people. We translate them into language that makes sense to everyone.' },
  { icon: '🧬', title: 'Evidence-Based', desc: 'We clearly label our evidence levels (high / moderate / limited / uncertain). We distinguish between established science and emerging research.' },
];

const TEAM_PRINCIPLES = [
  'We never label a legally permitted ingredient as "dangerous" without evidence context',
  'We always cite evidence levels alongside every claim',
  'We present both concerns and positives for every product',
  'We use language like "may be associated with" rather than definitive harm claims',
  'We update ingredient data as scientific understanding evolves',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-teal-950 text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-black text-2xl">K</span>
          </div>
          <h1 className="text-5xl font-black mb-4">About KnowYourProduct</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            We exist because product labels are designed to inform — but they aren't designed to be <em>understood</em>.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-6">Turning labels into knowledge.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>A typical packaged food product may contain 20–30 ingredients with scientific names. Names like <em>carrageenan, sodium benzoate, TBHQ, carmine</em> — terms that mean nothing to the average consumer.</p>
                <p>Meanwhile, product marketing emphasizes positive claims: "Natural!", "No Preservatives!", "Good Source of..." These phrases can be misleading or incomplete.</p>
                <p className="font-semibold text-slate-800">KnowYourProduct gives the other side of the story. Not to alarm — but to inform.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-3xl p-8 border border-indigo-100">
              <blockquote className="text-2xl font-black text-slate-800 leading-snug">
                "Don't scare the user.<br />
                <span className="text-indigo-600">Educate the user."</span>
              </blockquote>
              <p className="text-slate-500 text-sm mt-4">— The KnowYourProduct Philosophy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial principles */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-8">Our Editorial Principles</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <ul className="space-y-4">
              {TEAM_PRINCIPLES.map(p => (
                <li key={p} className="flex items-start gap-3">
                  <span className="text-indigo-500 font-black mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-slate-700 text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-amber-50 border-t border-amber-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="font-black text-amber-900 mb-3">Important Disclaimer</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            KnowYourProduct provides educational information for consumer awareness purposes. Our concern scores are not medical diagnoses, nutritional recommendations, or regulatory assessments. Individual health responses to ingredients vary. The platform is not affiliated with any government food safety agency. Always read product labels and consult qualified healthcare professionals for health decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Start understanding what you buy.</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/scan" className="bg-indigo-600 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-700 transition-colors">📷 Scan a Product</Link>
          <Link to="/how-it-works" className="border border-slate-200 text-slate-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-slate-50 transition-colors">How It Works</Link>
        </div>
      </section>
    </div>
  );
}

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
    <div className="min-h-screen bg-[var(--background)]">
      <section className="hero-gradient text-white py-16 sm:py-20 lg:py-24 text-center">
        <div className="page-shell page-shell--md relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-black text-2xl">K</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-black mb-5 leading-tight">About KnowYourProduct</h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We exist because product labels are designed to inform — but they aren't designed to be <em>understood</em>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">Our Mission</span>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-black text-slate-900 mt-5 mb-6">Turning labels into knowledge.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed max-w-xl">
                <p>A typical packaged food product may contain 20–30 ingredients with scientific names. Names like <em>carrageenan, sodium benzoate, TBHQ, carmine</em> — terms that mean nothing to the average consumer.</p>
                <p>Meanwhile, product marketing emphasizes positive claims: "Natural!", "No Preservatives!", "Good Source of..." These phrases can be misleading or incomplete.</p>
                <p className="font-semibold text-slate-800">KnowYourProduct gives the other side of the story. Not to alarm — but to inform.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-3xl p-8 sm:p-10 border border-indigo-100">
              <blockquote className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug">
                "Don't scare the user.<br />
                <span className="text-indigo-600">Educate the user."</span>
              </blockquote>
              <p className="text-slate-500 text-sm mt-5">— The KnowYourProduct Philosophy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="page-shell">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-black text-slate-900 text-center mb-4">Our Core Values</h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">The principles that shape every score and explanation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-grid">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm card-hover">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-3">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="page-shell page-shell--md">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-black text-slate-900 text-center mb-8">Our Editorial Principles</h2>
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8">
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

      <section className="py-10 sm:py-12 bg-amber-50 border-t border-amber-100">
        <div className="page-shell page-shell--md text-center">
          <h3 className="font-black text-amber-900 mb-3">Important Disclaimer</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            KnowYourProduct provides educational information for consumer awareness purposes. Our concern scores are not medical diagnoses, nutritional recommendations, or regulatory assessments. Individual health responses to ingredients vary. The platform is not affiliated with any government food safety agency. Always read product labels and consult qualified healthcare professionals for health decisions.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 text-center bg-white">
        <div className="page-shell">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-black text-slate-900 mb-6">Start understanding what you buy.</h2>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/scan" className="btn-primary">Scan a Product</Link>
            <Link to="/how-it-works" className="btn-ghost">How It Works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

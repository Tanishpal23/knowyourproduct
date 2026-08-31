import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 mt-auto">
      <div className="page-shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">K</span>
              </div>
              <span className="font-bold text-white text-base">KnowYourProduct</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              We translate complicated product labels into simple, honest explanations — so you know exactly what you're buying.
            </p>
            <div className="mt-5 p-4 bg-slate-800/80 rounded-xl text-xs text-slate-500 leading-relaxed border border-slate-700/60">
              <strong className="text-slate-400">Disclaimer:</strong> KnowYourProduct provides educational information for consumer awareness only. Ratings are not medical advice. Always consult a qualified healthcare professional for health concerns.
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[['/', 'Home'], ['/scan', 'Scan Product'], ['/search', 'Search'], ['/compare', 'Compare Products']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors duration-200 inline-block py-0.5">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm">
              {[['/how-it-works', 'How It Works'], ['/about', 'About Us'], ['/login', 'Login'], ['/signup', 'Sign Up']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors duration-200 inline-block py-0.5">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© 2026 KnowYourProduct. All rights reserved.</p>
          <p>Built with love by Tanish for consumer transparency &amp; education.</p>
        </div>
      </div>
    </footer>
  );
}

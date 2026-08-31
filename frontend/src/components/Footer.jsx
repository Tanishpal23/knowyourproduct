import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">K</span>
              </div>
              <span className="font-bold text-white">KnowYourProduct</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              We translate complicated product labels into simple, honest explanations — so you know exactly what you're buying.
            </p>
            <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-slate-500 leading-relaxed">
              ⚠️ <strong className="text-slate-400">Disclaimer:</strong> KnowYourProduct provides educational information for consumer awareness only. Ratings are not medical advice. Always consult a qualified healthcare professional for health concerns.
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/scan', 'Scan Product'], ['/search', 'Search'], ['/compare', 'Compare Products']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {[['/how-it-works', 'How It Works'], ['/about', 'About Us'], ['/login', 'Login'], ['/signup', 'Sign Up']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2026 KnowYourProduct. All rights reserved.</p>
          <p>Built for consumer transparency & education.</p>
        </div>
      </div>
    </footer>
  );
}

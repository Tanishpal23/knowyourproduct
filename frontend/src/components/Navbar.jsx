import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logoutUser(); navigate('/'); setMenuOpen(false); };
  const close = () => setMenuOpen(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Scan', to: '/scan' },
    { label: 'Search', to: '/search' },
    { label: 'Compare', to: '/compare' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 font-semibold'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-slate-200/60 border-b border-slate-100'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100/80'
      }`}
    >
      <div className="page-shell">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <Link to="/" onClick={close} className="flex items-center gap-2.5 group flex-shrink-0 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <span className="font-extrabold text-slate-800 text-[15px] sm:text-base tracking-tight truncate">
              Know<span className="text-indigo-600">Your</span>Product
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                <Link to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50/60 transition-all duration-200">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="hidden xl:block">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-sm font-semibold text-slate-600 hover:text-red-600 px-3 py-2 min-h-11 rounded-lg hover:bg-red-50 transition-all duration-200 border border-slate-200 hover:border-red-200">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-4 py-2 min-h-11 inline-flex items-center rounded-lg transition-all duration-200 hover:bg-indigo-50/60">
                  Log in
                </Link>
                <Link to="/signup"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 min-h-11 inline-flex items-center rounded-[10px] transition-all duration-200 shadow-sm hover:shadow-indigo-200 hover:shadow-md hover:-translate-y-px">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden p-2.5 min-w-11 min-h-11 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors duration-200"
          >
            <div className="w-5 h-4 flex flex-col justify-between mx-auto">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[min(100dvh,720px)] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-slate-100 px-5 sm:px-8 pt-3 pb-6 space-y-1">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={close}
              className={({ isActive }) =>
                `block px-4 py-3 min-h-11 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`
              }>
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={close}
                  className="flex items-center gap-3 px-4 py-3 min-h-11 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="text-left w-full px-4 py-3 min-h-11 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close}
                  className="block px-4 py-3 min-h-11 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200">
                  Log in
                </Link>
                <Link to="/signup" onClick={close}
                  className="block px-4 py-3 min-h-11 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-[10px] transition-all duration-200 text-center">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

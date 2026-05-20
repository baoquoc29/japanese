import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Kanji', path: '/kanji' },
    { name: 'Từ vựng', path: '/vocabulary' },
    { name: 'Ngữ pháp', path: '/grammar' },
    { name: 'Luyện viết', path: '/writing' },
    { name: 'Kiểm tra', path: '/kanji-test' },
    { name: 'Flashcard', path: '/flashcards' },
    { name: 'Sổ tay', path: '/favorites' },
    { name: 'In phiếu', path: '/print-practice' },
  ];

  const mobileBottomNavItems = [
    { name: 'Kanji', path: '/kanji' },
    { name: 'Từ vựng', path: '/vocabulary' },
    { name: 'Ngữ pháp', path: '/grammar' },
    { name: 'Flashcard', path: '/flashcards' },
    { name: 'Sổ tay', path: '/favorites' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121212] transition-colors duration-150">
      
      {/* ===== DESKTOP HEADER ===== */}
      <header className="hidden lg:block sticky top-0 z-50">
        <div className="bg-white dark:bg-zinc-900 border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            
            {/* Logo - Text only, no icon, no gradient text */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Nihongo Study
              </span>
            </Link>

            {/* Center Navigation - Simple text menu, no icons */}
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-xs font-medium transition-colors py-1 ${
                      active
                        ? 'text-indigo-600 dark:text-indigo-400 border-b border-indigo-600 dark:border-indigo-400 font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-neutral-400" />}
              </button>
              <button
                onClick={() => navigate('/kanji')}
                className="px-3.5 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Bắt đầu học
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE HEADER ===== */}
      <header className="lg:hidden sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/" className="flex items-center">
            <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Nihongo Study
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-neutral-400 dark:text-neutral-400 cursor-pointer"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-zinc-900 animate-fade-in">
            <nav className="p-3 grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          {children}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-neutral-200/80 dark:border-neutral-800/80 px-2 py-1 flex justify-around items-center z-40">
        {mobileBottomNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-lg transition-colors ${
                active 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;

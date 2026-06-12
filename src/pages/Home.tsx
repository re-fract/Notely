import { Link } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="bg-[#f9f9f9] dark:bg-[#141313] text-[#1a1c1c] dark:text-[#e5e2e1] min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center px-6 lg:px-12 w-full h-16 border-b-2 border-black dark:border-white bg-[#f9f9f9] dark:bg-[#141313] sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-black text-xl">psychology</span>
          <span className="font-headline-md text-xl font-black text-black dark:text-white">Notely</span>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors border border-transparent hover:border-black"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-sm">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <Link
            to="/sign-in"
            className="font-label-md text-sm text-gray-600 hover:underline hover:text-black transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/sign-in"
            className="font-label-md text-sm bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Hero Section */}
        <section className="w-full max-w-container-max flex flex-col items-center text-center gap-8 py-12 lg:py-24 border-2 border-black dark:border-white bg-white dark:bg-[#1c1b1b] p-6 lg:p-24 relative transition-colors duration-300" style={{ maxWidth: '1200px' }}>
          {/* Grid decorative background pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 max-w-[800px]">
            <h1 className="font-headline-lg text-3xl lg:text-5xl text-black dark:text-white font-display hidden lg:block">
              <TypewriterText text="Your thoughts, organized." speed={80} />
            </h1>
            <h1 className="font-headline-lg text-3xl lg:text-5xl text-black dark:text-white font-display lg:hidden">
              Your thoughts, organized.
            </h1>
            <p className="font-body-lg text-lg text-gray-600 dark:text-gray-400 max-w-[600px] mt-2">
              A structured environment for deep focus. Capture, connect, and synthesize knowledge without the visual noise.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="/sign-in"
                className="bg-black text-white font-label-md text-sm px-8 py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
                  arrow_forward
                </span>
              </Link>
              <a
                href="https://github.com/re-fract/Notely"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black border-2 border-black font-label-md text-sm px-8 py-4 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                View Repo
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
                  open_in_new
                </span>
              </a>
            </div>
          </div>

          {/* CSS-only Wireframe Illustration */}
          <div className="relative z-10 w-full max-w-[800px] h-[300px] mt-12 border-2 border-black dark:border-white bg-[#f9f9f9] dark:bg-[#201f1f] flex flex-col p-4 overflow-hidden transition-colors duration-300">
            {/* Browser Bar Mock */}
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <div className="w-3 h-3 border-2 border-black rounded-full"></div>
              <div className="w-3 h-3 border-2 border-black rounded-full"></div>
              <div className="w-3 h-3 border-2 border-black rounded-full"></div>
            </div>
            {/* Content Mock */}
            <div className="flex gap-4 h-full">
              {/* Sidebar Mock */}
              <div className="w-1/4 h-full border-r-2 border-black pr-4 flex flex-col gap-2 hidden sm:flex">
                <div className="w-full h-4 bg-[#e2e2e2] mb-2"></div>
                <div className="w-3/4 h-3 bg-[#cfc4c5]"></div>
                <div className="w-5/6 h-3 bg-[#cfc4c5]"></div>
                <div className="w-2/3 h-3 bg-[#cfc4c5]"></div>
              </div>
              {/* Editor Mock */}
              <div className="flex-grow h-full flex flex-col gap-4 pl-4 sm:pl-0">
                <div className="w-1/2 h-6 bg-black"></div>
                <div className="w-full h-3 bg-[#e2e2e2]"></div>
                <div className="w-full h-3 bg-[#e2e2e2]"></div>
                <div className="w-3/4 h-3 bg-[#e2e2e2]"></div>
                <div className="mt-auto flex gap-2">
                  <div className="w-16 h-6 border-2 border-black flex items-center justify-center">
                    <span className="font-label-sm text-xs">#idea</span>
                  </div>
                  <div className="w-16 h-6 border-2 border-black flex items-center justify-center">
                    <span className="font-label-sm text-xs">#draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 w-full py-8 border-t-2 border-black dark:border-white">
        <div className="font-label-md text-sm font-bold text-black dark:text-white">
          Notely. Built for focus.
        </div>
        <div className="font-label-sm text-xs text-gray-500 dark:text-gray-400">
          React + Express + Tailwind
        </div>
      </footer>
    </div>
  );
};

export default Home;

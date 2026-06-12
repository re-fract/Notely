import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, firstName, lastName);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error;
      if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        setError('Cannot connect to the server. Please make sure the backend is running (npm run dev:all).');
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError(isSignUp ? 'Failed to create account. Please try again.' : 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 md:px-8 antialiased dark:bg-[#141313] transition-colors duration-300"
      style={{
        backgroundImage: 'radial-gradient(#cfc4c5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0',
        backgroundColor: '#F5F5F5',
      }}
    >
      <main
        id="auth-card"
        className="w-full max-w-md bg-white dark:bg-[#1c1b1b] border-2 border-black dark:border-white wireframe-card-shadow dark:shadow-white/20 transition-all duration-300 relative z-10"
      >
        {/* Header */}
        <header className="p-6 border-b-2 border-black dark:border-white transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-black dark:text-white transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_tree
              </span>
              <h1 className="font-headline-md text-xl font-bold text-black dark:text-white tracking-tight transition-colors">Notely</h1>
            </div>
            <Link
              to="/"
              className="font-label-sm text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Home
            </Link>
          </div>
          <h2 className="font-headline-lg text-3xl font-semibold text-black dark:text-white transition-colors" id="auth-title">
            {isSignUp ? 'Provision Account' : 'Access Vault'}
          </h2>
          <p className="font-body-md text-base text-gray-600 dark:text-gray-400 mt-2 transition-colors">
            {isSignUp
              ? 'Create your structured knowledge space.'
              : 'Authenticate to enter your structured knowledge space.'}
          </p>
        </header>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col animate-form-transition" key={isSignUp ? 'signup' : 'signin'}>
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-xs text-black dark:text-white uppercase tracking-widest transition-colors">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="wireframe-input w-full p-4 border border-black dark:border-white bg-white dark:bg-[#201f1f] font-body-md text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-xs text-black dark:text-white uppercase tracking-widest transition-colors">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="wireframe-input w-full p-4 border border-black dark:border-white bg-white dark:bg-[#201f1f] font-body-md text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-xs text-black dark:text-white uppercase tracking-widest transition-colors" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="wireframe-input w-full p-4 border border-black dark:border-white bg-white dark:bg-[#201f1f] font-body-md text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                placeholder="researcher@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-sm text-xs text-black dark:text-white uppercase tracking-widest transition-colors" htmlFor="password">
                  Passphrase
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="wireframe-input w-full p-4 border border-black dark:border-white bg-white dark:bg-[#201f1f] font-body-md text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-12"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 text-sm font-body-md">
                {error}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="wireframe-button wireframe-button-shadow w-full py-4 bg-black dark:bg-white text-white dark:text-black font-label-md text-sm font-bold transition-all border-2 border-black dark:border-white hover:bg-white dark:hover:bg-[#201f1f] hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Processing...' : isSignUp ? 'Allocate Account' : 'Initialize Session'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="w-full py-2 bg-transparent text-black dark:text-white font-label-sm text-xs hover:underline transition-colors"
              >
                {isSignUp ? 'Switch to Access (Sign In)' : 'Switch to Provisioning (Sign Up)'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t-2 border-black dark:border-white bg-gray-100 dark:bg-[#201f1f] flex justify-between items-center transition-colors duration-300">
          <span className="font-label-sm text-xs text-gray-600 dark:text-gray-400 transition-colors">SYS_STATUS: READY</span>
          <span className="font-label-sm text-xs text-gray-600 dark:text-gray-400 transition-colors">v2.4.1</span>
        </div>
      </main>
    </div>
  );
};

export default SignIn;

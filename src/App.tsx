import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Notebook from './pages/Notebook';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in" key={useLocation().pathname}>
      {children}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
      <Route path="/sign-in/*" element={<AnimatedPage><SignIn /></AnimatedPage>} />
      <Route path="/sign-up/*" element={<AnimatedPage><SignUp /></AnimatedPage>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AnimatedPage><Dashboard /></AnimatedPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notebook/:noteId"
        element={
          <ProtectedRoute>
            <AnimatedPage><Notebook /></AnimatedPage>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

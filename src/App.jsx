import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/common/LoadingScreen.jsx';

// The landing page has no data dependencies, so keep it in the initial render
// path instead of making the first screen wait for a route chunk.
import Landing from './pages/Landing.jsx';
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Success = lazy(() => import('./pages/Success.jsx'));

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (window.location.pathname !== '/') return false;

    try {
      return sessionStorage.getItem('flowsync-intro-seen') !== 'true';
    } catch {
      return true;
    }
  });
  const finishIntro = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    if (!showIntro) return;
    try {
      sessionStorage.setItem('flowsync-intro-seen', 'true');
    } catch {
      // The mounted App state still prevents replay during this visit.
    }
  }, [showIntro]);

  return (
    <>
      <Suspense fallback={<div className="page-loader" aria-label="Loading"><div className="page-loader-spinner" /></div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Suspense>
      {showIntro && <LoadingScreen onComplete={finishIntro} />}
    </>
  );
}

export default App;

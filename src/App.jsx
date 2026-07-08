import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Success = lazy(() => import('./pages/Success.jsx'));

function App() {
  return (
    <Suspense fallback={<div className="page-loader" aria-label="Loading"><div className="page-loader-spinner" /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Suspense>
  );
}

export default App;

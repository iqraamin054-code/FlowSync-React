import { useState } from 'react';
import Navbar from '../components/layout/Navbar/Navbar.jsx';
import AnimatedBackground from '../components/common/AnimatedBackground.jsx';
import Hero from '../components/landing/Hero/Hero.jsx';
import TrustedCompanies from '../components/landing/TrustedCompanies.jsx';
import Problems from '../components/landing/Problems.jsx';
import Solution from '../components/landing/Solution.jsx';
import Features from '../components/landing/Features.jsx';
import Statistics from '../components/landing/Statistics.jsx';
import FeatureComparison from '../components/landing/FeatureComparison.jsx';
import Pricing from '../components/landing/Pricing.jsx';
import PricingCalculator from '../components/landing/PricingCalculator.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import Faq from '../components/landing/Faq.jsx';
import Contact from '../components/landing/Contact.jsx';
import Footer from '../components/layout/Footer.jsx';
import LoginModal from '../components/common/LoginModal.jsx';
import CursorGlow from '../components/common/CursorGlow.jsx';
import BackToTop from '../components/common/BackToTop.jsx';
import ScrollProgress from '../components/common/ScrollProgress.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [solutionState, setSolutionState] = useState('default');
  useScrollReveal();

  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <main className="landing-main">
        <Hero />
        <TrustedCompanies />
        <Problems onHover={setSolutionState} />
        <Solution activeState={solutionState} />
        <Features />
        <Statistics />
        <FeatureComparison />
        <PricingCalculator />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
        <Footer />
      </main>
      {loginOpen && (
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      )}
      <CursorGlow />
      <BackToTop />
    </>
  );
}

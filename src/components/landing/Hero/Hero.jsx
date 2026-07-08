import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import ProductOverview from '../ProductOverview.jsx';
import './Hero.css';

const trustItems = ['No credit card', 'Free 14-day trial', 'Cancel anytime'];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981"
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.12 },
  }),
};

const glowVariant = {
  animate: (i) => ({
    x: [0, i % 2 === 0 ? 20 : -20, 0],
    y: [0, i % 2 === 0 ? -15 : 15, 0],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut' },
  }),
};

const Hero = () => {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const handleStartFreeTrial = () => navigate('/onboarding');
  const handleLiveDemo = (e) => {
    e.preventDefault();
    const target = document.getElementById('product-showcase') || document.getElementById('features');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero">
      <motion.div
        className="hero-glow hero-glow-1"
        aria-hidden="true"
        custom={0}
        animate={prefersReduced ? {} : 'animate'}
        variants={glowVariant}
      />
      <motion.div
        className="hero-glow hero-glow-2"
        aria-hidden="true"
        custom={1}
        animate={prefersReduced ? {} : 'animate'}
        variants={glowVariant}
      />
      <motion.div
        className="hero-glow hero-glow-3"
        aria-hidden="true"
        custom={2}
        animate={prefersReduced ? {} : 'animate'}
        variants={glowVariant}
      />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-radial" aria-hidden="true" />

      <div className="container hero-layout">
        {/* LEFT — Hero Content */}
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            aria-label="Trusted by 5000 plus growing teams worldwide"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="badge-emoji">🚀</span>
            <span>Trusted by 5,000+ growing teams worldwide</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="title-line">One Workspace.</span>
            <span className="title-line">Every Team.</span>
            <span className="title-line title-gradient">
              <span className="gradient-shimmer" aria-hidden="true" />
              Unlimited Growth.
            </span>
          </motion.h1>

          <motion.p
            className="hero-desc"
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            Streamline projects, automate workflows, collaborate in real time,
            and make smarter business decisions with a unified productivity platform.
          </motion.p>

          <motion.div
            className="hero-buttons"
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <motion.button
              type="button"
              className="btn btn-primary btn-lg hero-btn-primary"
              onClick={handleStartFreeTrial}
              whileHover={prefersReduced ? {} : { scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Start Free Trial
              <ArrowIcon />
            </motion.button>
            <motion.button
              type="button"
              className="btn btn-secondary btn-lg hero-btn-secondary"
              onClick={handleLiveDemo}
              whileHover={prefersReduced ? {} : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Book a Demo
              <ArrowIcon />
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-trust"
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            {trustItems.map((item) => (
              <span className="trust-item" key={item}>
                <CheckIcon />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Dashboard Preview */}
        <ProductOverview prefersReduced={prefersReduced} />
      </div>
    </section>
  );
};

export default Hero;

import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import ProductOverview from '../ProductOverview.jsx';
import './Hero.css';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

  const handleGetStarted = () => navigate('/onboarding');
  const handleLiveDemo = (e) => {
    e.preventDefault();
    const target = document.getElementById('solution') || document.getElementById('features');
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
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="badge-sparkle">✨</span>
            <span>AI Powered Productivity Platform</span>
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
            FlowSync brings your projects, workflows, and team collaboration into one
            intelligent workspace. Automate repetitive tasks, track progress in real time,
            and make data-driven decisions all from a single dashboard.
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
              onClick={handleGetStarted}
              whileHover={prefersReduced ? {} : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Get Started
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
              Live Demo
              <ArrowIcon />
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-rating"
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="hero-stars" aria-label="4.9 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="hero-rating-text">
              <strong>4.9</strong>/5 from <strong>10,000+</strong> teams
            </span>
          </motion.div>
        </div>

        <ProductOverview prefersReduced={prefersReduced} />
      </div>
    </section>
  );
};

export default Hero;

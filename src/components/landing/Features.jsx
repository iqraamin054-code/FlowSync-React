import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import './Hero/Hero.css';
import { features } from '../../data/landingContent';

const badgeMap = {
  'Real-time Analytics': 'AI',
  'Team Collaboration': 'NEW',
  'Workflow Automation': 'FAST',
  'Project Management': 'PRO',
  'Integrations': 'POPULAR',
  'Enterprise Security': 'SECURE',
};

const iconMap = {
  analytics: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  ),
  team: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  lightning: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  board: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

export default function Features() {
  const prefersReduced = useReducedMotion();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const headerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section className="features-section" id="features" aria-labelledby="features-heading">
      <div className="features-bg-glow" />
      <div className="features-bg-grid" />
      <div className="features-particle features-particle-1" />
      <div className="features-particle features-particle-2" />
      <div className="features-particle features-particle-3" />

      <div className="container">
        <motion.div
          className="section-header"
          ref={headerRef}
          variants={prefersReduced ? undefined : headerVariants}
          initial={prefersReduced ? undefined : 'hidden'}
          animate={prefersReduced ? undefined : headerInView ? 'visible' : 'hidden'}
        >
          <motion.span className="badge badge-primary" variants={itemVariants}>Features</motion.span>
          <motion.h2 className="section-title section-title-center" id="features-heading" variants={itemVariants}>Everything you need to scale</motion.h2>
          <motion.p className="section-desc" variants={itemVariants}>From project management to analytics, FlowSync gives your team the tools to move faster and ship smarter.</motion.p>
        </motion.div>

        <div className="features-grid" role="list">
          {features.map((feature, i) => (
            <motion.div
              className="feature-card"
              key={feature.title}
              role="listitem"
              tabIndex={0}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="feature-badge" aria-label={`Status: ${badgeMap[feature.title]}`}>{badgeMap[feature.title]}</span>
              <div className={`feature-icon${feature.accent === 'violet' ? ' feature-icon-violet' : feature.accent === 'green' ? ' feature-icon-green' : ''}`}>
                {iconMap[feature.icon]}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
              <div className="feature-accent-line" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

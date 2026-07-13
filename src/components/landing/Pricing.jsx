import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pricingPlans } from '../../data/pricing';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.12 },
  }),
};

const priceVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan) => {
    if (plan.price === 0) return 0;
    return annual ? Math.round(plan.price * 0.8) : plan.price;
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <span className="pricing-section-badge">Pricing</span>
          <h2 className="section-title section-title-center">Choose the perfect plan for your team</h2>
          <p className="section-desc">Simple, transparent pricing designed to scale with startups, growing businesses, and enterprises.</p>
        </div>

        <div className="pricing-toggle">
          <span className={`pricing-toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
          <button
            className="pricing-toggle-switch"
            onClick={() => setAnnual(!annual)}
            aria-label={`Switch to ${annual ? 'monthly' : 'annual'} billing`}
            role="switch"
            aria-checked={annual}
          >
            <span className={`pricing-toggle-knob${annual ? ' annual' : ''}`} />
          </button>
          <span className={`pricing-toggle-label${annual ? ' active' : ''}`}>
            Yearly
            <span className="pricing-save">Save 20%</span>
          </span>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`pricing-card${plan.featured ? ' pricing-card-featured' : ''}`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
            >
              {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
              <div className="pricing-header">
                <span className="pricing-name">{plan.name}</span>
                <span className="pricing-desc">{plan.description}</span>
              </div>
              <div className="pricing-amount">
                <span className="pricing-currency">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={annual ? 'annual' : 'monthly'}
                    className="pricing-value"
                    variants={priceVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {getPrice(plan)}
                  </motion.span>
                </AnimatePresence>
                <span className="pricing-period">{plan.price === 0 ? '/mo' : annual ? '/mo billed yearly' : plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={`pricing-feature${feature.included ? '' : ' disabled'}`}>
                    {feature.included ? <CheckIcon /> : <XIcon />}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className={`btn btn-pricing ${plan.ctaClass}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

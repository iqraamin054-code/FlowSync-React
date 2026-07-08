import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pricingPlans } from '../../data/pricing';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
  }),
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan) => {
    if (plan.price === 0) return 0;
    return annual ? Math.round(plan.price * 0.8) : plan.price;
  };

  return (
    <section className="pricing-section reveal" id="pricing">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-success">Pricing</span>
          <h2 className="section-title section-title-center">Simple, transparent pricing</h2>
          <p className="section-desc">Start free, upgrade when you grow. No hidden fees, no surprise charges.</p>
        </div>

        <div className="pricing-toggle reveal">
          <span className={`pricing-toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
          <button className="pricing-toggle-switch" onClick={() => setAnnual(!annual)} aria-label={`Switch to ${annual ? 'monthly' : 'annual'} billing`}>
            <span className={`pricing-toggle-knob${annual ? ' annual' : ''}`} />
          </button>
          <span className={`pricing-toggle-label${annual ? ' active' : ''}`}>Yearly <span className="pricing-save">Save 20%</span></span>
        </div>

        <div className="pricing-grid reveal-stagger">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`pricing-card reveal${plan.featured ? ' pricing-card-featured' : ''}`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
              <div className="pricing-header">
                <span className="pricing-name">{plan.name}</span>
                <span className="pricing-desc">{plan.description}</span>
              </div>
              <div className="pricing-amount">
                <span className="pricing-currency">$</span>
                <span className="pricing-value">{getPrice(plan)}</span>
                <span className="pricing-period">{plan.price === 0 ? '/mo' : annual ? '/mo billed yearly' : plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature.text} className={feature.included ? 'pricing-feature' : 'pricing-feature disabled'}>
                    {feature.included ? <CheckIcon /> : <XIcon />}
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className={`btn ${plan.ctaClass}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

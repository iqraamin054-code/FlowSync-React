import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const plans = ['Starter', 'Professional', 'Enterprise'];

const features = [
  { name: 'Unlimited Projects', starter: true, professional: true, enterprise: true },
  { name: 'Team Members', starter: 'Up to 5', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'AI Assistant', starter: false, professional: true, enterprise: true },
  { name: 'Workflow Automation', starter: false, professional: true, enterprise: true },
  { name: 'Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
  { name: 'Custom Branding', starter: false, professional: false, enterprise: true },
  { name: 'Integrations', starter: '5 apps', professional: '25 apps', enterprise: 'Unlimited' },
  { name: 'Support', starter: 'Community', professional: 'Priority', enterprise: 'Dedicated' },
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const cellValue = (val) => {
  if (val === true) return <CheckIcon />;
  if (val === false) return <XIcon />;
  return <span className="compare-text">{val}</span>;
};

export default function FeatureComparison() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="compare-section reveal" id="compare">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-primary">Compare Plans</span>
          <h2 className="section-title section-title-center">Feature comparison</h2>
          <p className="section-desc">See which plan is right for your team.</p>
        </div>

        {/* Desktop table */}
        <div className="compare-table-wrapper reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-feature-col">Feature</th>
                {plans.map((p) => (
                  <th key={p} className={`compare-plan-col${p === 'Professional' ? ' compare-plan-featured' : ''}`}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.name} className="compare-row">
                  <td className="compare-feature-name">{f.name}</td>
                  <td className={`compare-cell${plans[0] === 'Professional' ? ' compare-cell-featured' : ''}`}>{cellValue(f.starter)}</td>
                  <td className="compare-cell compare-cell-featured">{cellValue(f.professional)}</td>
                  <td className="compare-cell">{cellValue(f.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile accordion */}
        <div className="compare-mobile reveal-stagger">
          {plans.map((plan, pi) => (
            <div key={plan} className={`compare-mobile-card reveal${plan === 'Professional' ? ' compare-mobile-featured' : ''}`}>
              <button
                className="compare-mobile-header"
                onClick={() => setExpanded(expanded === pi ? null : pi)}
                aria-expanded={expanded === pi}
              >
                <span className="compare-mobile-plan">{plan}</span>
                <svg className={`compare-mobile-chevron${expanded === pi ? ' open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <AnimatePresence>
                {expanded === pi && (
                  <motion.div
                    className="compare-mobile-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {features.map((f) => {
                      const val = f[plan.toLowerCase()];
                      return (
                        <div key={f.name} className="compare-mobile-row">
                          <span className="compare-mobile-feature">{f.name}</span>
                          <span className="compare-mobile-value">{cellValue(val)}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

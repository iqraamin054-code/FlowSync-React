import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = {
  starter: { name: 'Starter', monthly: 12, cta: 'Start Free Trial', href: '/onboarding' },
  professional: { name: 'Professional', monthly: 24, cta: 'Start 14-Day Trial', href: '/onboarding' },
  enterprise: { name: 'Enterprise', monthly: 39, cta: 'Contact Sales', href: '#contact' },
};

function getRecommendedPlan(size) {
  if (size <= 10) return 'starter';
  if (size <= 30) return 'professional';
  return 'enterprise';
}

function useCountUp(target, duration = 400) {
  const mountRef = useRef(true);
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    if (mountRef.current) {
      mountRef.current = false;
      fromRef.current = 0;
    } else {
      fromRef.current = display;
    }
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(fromRef.current + (target - fromRef.current) * eased);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return display;
}

function AnimatedPrice({ value, decimals = 0 }) {
  const mountRef = useRef(true);
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    if (mountRef.current) {
      mountRef.current = false;
      fromRef.current = 0;
    } else {
      fromRef.current = display;
    }
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / 500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-US')}</>;
}

export default function PricingCalculator() {
  const [teamSize, setTeamSize] = useState(1);
  const [billing, setBilling] = useState('monthly');
  const [plan, setPlan] = useState('starter');

  const isYearly = billing === 'yearly';
  const recommended = getRecommendedPlan(teamSize);

  const calculations = useMemo(() => {
    const pricePerUser = PLANS[plan].monthly;
    const monthlyCost = pricePerUser * teamSize;
    const yearlyTotal = isYearly ? monthlyCost * 12 * 0.8 : monthlyCost * 12;
    const yearlyAtFull = monthlyCost * 12;
    const savings = isYearly ? yearlyAtFull - yearlyTotal : 0;
    const displayPerUser = isYearly ? (pricePerUser * 0.8).toFixed(0) : pricePerUser;
    const displayMonthlyCost = isYearly ? monthlyCost * 0.8 : monthlyCost;

    return { pricePerUser, monthlyCost, yearlyTotal, yearlyAtFull, savings, displayPerUser, displayMonthlyCost };
  }, [plan, teamSize, isYearly]);

  const { pricePerUser, yearlyTotal, savings, displayPerUser, displayMonthlyCost } = calculations;

  const animatedTeamSize = useCountUp(teamSize, 300);
  const animatedMonthly = useCountUp(Math.round(displayMonthlyCost), 400);
  const animatedYearly = useCountUp(Math.round(yearlyTotal), 400);
  const animatedSavings = useCountUp(Math.round(savings), 400);

  return (
    <section className="calculator-section reveal" id="calculator" aria-labelledby="calc-heading">
      <div className="container">
        <div className="section-header">
          <motion.span
            className="badge badge-secondary"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Calculator
          </motion.span>
          <motion.h2
            className="section-title section-title-center"
            id="calc-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            Estimate Your FlowSync Cost
          </motion.h2>
          <motion.p
            className="section-desc"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            See how much your team would pay before starting your free trial.
          </motion.p>
        </div>

        <div className="calculator-grid">
          <div className="calculator-controls glass-card" role="form" aria-label="Pricing calculator">
            <div className="calc-field">
              <label className="calc-label" htmlFor="team-size">
                Team Size
                <motion.span
                  className="calc-value-display"
                  key={teamSize}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {teamSize}
                </motion.span>
              </label>
              <div className="calc-slider-wrap">
                <span className="calc-slider-bound">1</span>
                <input
                  type="range"
                  id="team-size"
                  className="calc-slider"
                  min="1"
                  max="100"
                  value={teamSize}
                  aria-valuemin="1"
                  aria-valuemax="100"
                  aria-valuenow={teamSize}
                  aria-label="Select number of team members"
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                />
                <span className="calc-slider-bound">100</span>
              </div>
            </div>

            <fieldset className="calc-field">
              <legend className="calc-label">Billing Cycle</legend>
              <div className="calc-radios">
                <label className="calc-radio">
                  <input type="radio" name="billing" value="monthly" checked={billing === 'monthly'} onChange={() => setBilling('monthly')} />
                  <span className="calc-radio-indicator"></span>
                  <span className="calc-radio-text">Monthly</span>
                </label>
                <label className="calc-radio">
                  <input type="radio" name="billing" value="yearly" checked={billing === 'yearly'} onChange={() => setBilling('yearly')} />
                  <span className="calc-radio-indicator"></span>
                  <span className="calc-radio-text">Yearly</span>
                  <span className="calc-discount-badge">Save 20%</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="calc-field">
              <legend className="calc-label">Plan</legend>
              <div className="calc-plan-options" role="radiogroup" aria-label="Select a plan">
                {Object.entries(PLANS).map(([key, p]) => (
                  <button
                    key={key}
                    className={`calc-plan-btn${plan === key ? ' active' : ''}`}
                    data-plan={key}
                    role="radio"
                    aria-checked={plan === key}
                    tabIndex={plan === key ? 0 : -1}
                    onClick={() => setPlan(key)}
                  >
                    {p.name}
                    {recommended === key && (
                      <span className="calc-rec-badge" aria-label="Recommended plan">Recommended</span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {teamSize > 75 && (
              <motion.div
                className="calc-enterprise-notice"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Need more than 75 users? <strong>Contact Sales</strong> for volume discounts.</span>
              </motion.div>
            )}

            <div className="calc-pricing-ref">
              <span>Starter <strong>$12</strong>/user/mo</span>
              <span>Professional <strong>$24</strong>/user/mo</span>
              <span>Enterprise <strong>$39</strong>/user/mo</span>
            </div>
          </div>

          <div className="calculator-result glass-card" aria-label="Pricing estimate">
            <div className="calc-result-header">
              <div className="calc-result-plan">
                <span className="calc-result-badge">{PLANS[plan].name}</span>
                <span className="calc-result-sub">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="calc-result-amount">
                <span className="calc-result-currency">$</span>
                <span className="calc-result-price">
                  <AnimatedPrice value={displayMonthlyCost} />
                </span>
                <span className="calc-result-period">/mo</span>
              </div>
            </div>

            <div className="calc-breakdown">
              {animatedTeamSize} users × <strong>${isYearly ? displayPerUser : pricePerUser}</strong> = <strong>${animatedMonthly.toLocaleString('en-US')}/mo</strong>
            </div>

            <div className="calc-result-details">
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                  Team Members
                </span>
                <span className="calc-detail-value">{animatedTeamSize}</span>
              </div>
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Billing Cycle
                </span>
                <span className="calc-detail-value">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              {isYearly && (
                <motion.div
                  className="calc-detail-row calc-detail-discount"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="calc-detail-label calc-detail-label-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Yearly Discount (20%)
                  </span>
                  <span className="calc-detail-value calc-detail-value-green">
                    <AnimatedPrice value={savings} decimals={2} />
                  </span>
                </motion.div>
              )}
              <div className="calc-detail-divider"></div>
              <div className="calc-detail-row calc-detail-total">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  Estimated Monthly Cost
                </span>
                <span className="calc-detail-value calc-detail-value-lg">
                  ${animatedMonthly.toLocaleString('en-US')}
                </span>
              </div>
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  Estimated Yearly Cost
                </span>
                <span className="calc-detail-value">
                  ${animatedYearly.toLocaleString('en-US')}
                </span>
              </div>
              {isYearly && (
                <motion.div
                  className="calc-detail-row calc-detail-savings"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <span className="calc-detail-label calc-detail-label-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    Savings
                  </span>
                  <span className="calc-detail-value calc-detail-value-green">
                    ${animatedSavings.toLocaleString('en-US')}/year
                  </span>
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${plan}-${teamSize}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Link to={PLANS[plan].href} className="btn btn-primary calc-cta">
                  {PLANS[plan].cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

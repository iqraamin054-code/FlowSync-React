import { useState } from 'react';
import { Link } from 'react-router-dom';

const PLANS = {
  starter: { name: 'Starter', monthly: 12 },
  professional: { name: 'Professional', monthly: 24 },
  enterprise: { name: 'Enterprise', monthly: 39 },
};

export default function PricingCalculator() {
  const [teamSize, setTeamSize] = useState(1);
  const [billing, setBilling] = useState('monthly');
  const [plan, setPlan] = useState('starter');

  const price = PLANS[plan].monthly;
  const isYearly = billing === 'yearly';
  const monthlyCost = price * teamSize;
  const yearlyCost = isYearly ? monthlyCost * 0.8 * 12 : monthlyCost * 12;
  const displayPrice = isYearly ? (price * 0.8).toFixed(0) : price;
  const savings = isYearly ? (monthlyCost * 12 - yearlyCost).toFixed(2) : '0.00';

  return (
    <section className="calculator-section reveal" id="calculator">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-secondary">Calculator</span>
          <h2 className="section-title section-title-center">Estimate Your FlowSync Cost</h2>
          <p className="section-desc">See how much your team would pay before starting your free trial.</p>
        </div>

        <div className="calculator-grid">
          <div className="calculator-controls glass-card" role="form" aria-label="Pricing calculator">
            <div className="calc-field">
              <label className="calc-label" htmlFor="team-size">
                Team Size
                <span className="calc-value-display" id="team-size-value">{teamSize}</span>
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
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="calc-pricing-ref">
              <span>Starter <strong>$12</strong>/user/mo</span>
              <span>Professional <strong>$24</strong>/user/mo</span>
              <span>Enterprise <strong>$39</strong>/user/mo</span>
            </div>
          </div>

          <div className="calculator-result glass-card" aria-label="Pricing estimate">
            <div className="calc-result-header">
              <div className="calc-result-plan">
                <span className="calc-result-badge" id="calc-plan-badge">{PLANS[plan].name}</span>
                <span className="calc-result-sub" id="calc-billing-label">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="calc-result-amount">
                <span className="calc-result-currency">$</span>
                <span className="calc-result-price" id="calc-monthly-price">{displayPrice}</span>
                <span className="calc-result-period" id="calc-period-label">/mo</span>
              </div>
            </div>

            <div className="calc-result-details">
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                  Team Members
                </span>
                <span className="calc-detail-value" id="calc-members">{teamSize}</span>
              </div>
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Billing Cycle
                </span>
                <span className="calc-detail-value" id="calc-billing-display">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              {isYearly && (
                <div className="calc-detail-row calc-detail-discount" id="calc-discount-row">
                  <span className="calc-detail-label calc-detail-label-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Yearly Discount (20%)
                  </span>
                  <span className="calc-detail-value calc-detail-value-green" id="calc-discount-amount">${savings}</span>
                </div>
              )}
              <div className="calc-detail-divider"></div>
              <div className="calc-detail-row calc-detail-total">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  Estimated Monthly Cost
                </span>
                <span className="calc-detail-value calc-detail-value-lg" id="calc-estimated-monthly">${monthlyCost.toFixed(2)}</span>
              </div>
              <div className="calc-detail-row">
                <span className="calc-detail-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  Estimated Yearly Cost
                </span>
                <span className="calc-detail-value" id="calc-estimated-yearly">${yearlyCost.toFixed(2)}</span>
              </div>
              {isYearly && (
                <div className="calc-detail-row calc-detail-savings" id="calc-savings-row">
                  <span className="calc-detail-label calc-detail-label-save">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    Savings
                  </span>
                  <span className="calc-detail-value calc-detail-value-green" id="calc-savings">${savings}/year</span>
                </div>
              )}
            </div>

            <Link to="/onboarding" className="btn btn-primary calc-cta" id="calc-cta">
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

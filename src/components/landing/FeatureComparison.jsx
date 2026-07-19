import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FeatureComparison.css';

const plans = [
  {
    name: 'Starter',
    price: 0,
    period: '/mo',
    description: 'For individuals getting started',
    cta: 'Get Started',
    href: '/onboarding',
    featured: false,
  },
  {
    name: 'Professional',
    price: 29,
    period: '/mo',
    description: 'For growing teams that need more',
    cta: 'Start Free Trial',
    href: '/onboarding',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    period: '/mo',
    description: 'For large organizations',
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
];

const categories = [
  {
    name: 'General',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    features: [
      { name: 'Unlimited Projects', starter: true, professional: true, enterprise: true },
      { name: 'Team Members', starter: 'Up to 5', professional: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Storage', starter: '5 GB', professional: '50 GB', enterprise: 'Unlimited' },
    ],
  },
  {
    name: 'Productivity',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    features: [
      { name: 'AI Assistant', starter: false, professional: true, enterprise: true },
      { name: 'Workflow Automation', starter: false, professional: true, enterprise: true },
      { name: 'Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
    ],
  },
  {
    name: 'Collaboration',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    features: [
      { name: 'Custom Branding', starter: false, professional: false, enterprise: true },
      { name: 'Integrations', starter: '5 apps', professional: '25 apps', enterprise: 'Unlimited' },
    ],
  },
  {
    name: 'Support',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    features: [
      { name: 'Support', starter: 'Community', professional: 'Priority', enterprise: 'Dedicated' },
    ],
  },
];

const CheckIcon = () => (
  <span className="cmp-icon cmp-check" aria-label="Included">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const XIcon = () => (
  <span className="cmp-icon cmp-x" aria-label="Not available">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </span>
);

const cellValue = (val) => {
  if (val === true) return <CheckIcon />;
  if (val === false) return <XIcon />;
  return <span className="cmp-text">{val}</span>;
};

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const tableVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.1 } },
};

export default function FeatureComparison() {
  return (
    <section className="cmp-section reveal" id="compare">
      <div className="cmp-inner">
        <motion.div
          className="cmp-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
        >
          <span className="cmp-badge">Compare Plans</span>
          <h2 className="cmp-title">Everything you need, at every stage of growth.</h2>
          <p className="cmp-desc">Compare features across all plans and choose the solution that best fits your team.</p>
        </motion.div>

        <motion.div
          className="cmp-scroll"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={tableVariants}
        >
          {/* ── SINGLE PARENT GRID ── */}
          <div className="cmp-grid" role="grid" aria-label="Pricing comparison">

            {/* ════════ HEADER ROW ════════ */}
            <div className="cmp-row cmp-row-header">
              <div className="cmp-cell cmp-cell-feature cmp-cell-header-feature" role="columnheader">
                <span className="cmp-feature-title">Feature</span>
              </div>
              <div className="cmp-cell cmp-cell-plan cmp-cell-header-plan" role="columnheader" data-plan="starter">
                <span className="cmp-plan-name">Starter</span>
                <div className="cmp-price-wrap">
                  <span className="cmp-price">$0</span>
                  <span className="cmp-period">/mo</span>
                </div>
                <p className="cmp-plan-desc">For individuals getting started</p>
                <Link to="/onboarding" className="cmp-btn cmp-btn-outline">Get Started</Link>
              </div>
              <div className="cmp-cell cmp-cell-plan cmp-cell-header-plan cmp-cell-featured-col" role="columnheader" data-plan="professional">
                <span className="cmp-popular-badge">Most Popular</span>
                <span className="cmp-plan-name cmp-plan-name-featured">Professional</span>
                <div className="cmp-price-wrap">
                  <span className="cmp-price">$29</span>
                  <span className="cmp-period">/mo</span>
                </div>
                <p className="cmp-plan-desc cmp-plan-desc-featured">For growing teams that need more</p>
                <Link to="/onboarding" className="cmp-btn cmp-btn-gradient">Start Free Trial</Link>
              </div>
              <div className="cmp-cell cmp-cell-plan cmp-cell-header-plan" role="columnheader" data-plan="enterprise">
                <span className="cmp-plan-name">Enterprise</span>
                <div className="cmp-price-wrap">
                  <span className="cmp-price">$99</span>
                  <span className="cmp-period">/mo</span>
                </div>
                <p className="cmp-plan-desc">For large organizations</p>
                <a href="#contact" className="cmp-btn cmp-btn-outline">Contact Sales</a>
              </div>
            </div>

            {/* ════════ CATEGORY & FEATURE ROWS ════════ */}
            {categories.map((cat) => (
              <div key={cat.name} className="cmp-category-group">
                {/* Category Row — 4 cells, only first has content */}
                <div className="cmp-row cmp-row-category">
                  <div className="cmp-cell cmp-cell-category">
                    <span className="cmp-cat-icon">{cat.icon}</span>
                    <span className="cmp-cat-text">{cat.name}</span>
                  </div>
                  <div className="cmp-cell cmp-cell-category cmp-cell-category-empty" />
                  <div className="cmp-cell cmp-cell-category cmp-cell-category-empty cmp-cell-featured-col" />
                  <div className="cmp-cell cmp-cell-category cmp-cell-category-empty" />
                </div>
                {/* Feature Rows */}
                {cat.features.map((f) => (
                  <div className="cmp-row cmp-row-feature" key={f.name}>
                    <div className="cmp-cell cmp-cell-feature">{f.name}</div>
                    <div className="cmp-cell cmp-cell-plan" data-plan="starter">{cellValue(f.starter)}</div>
                    <div className="cmp-cell cmp-cell-plan cmp-cell-featured-col" data-plan="professional">{cellValue(f.professional)}</div>
                    <div className="cmp-cell cmp-cell-plan" data-plan="enterprise">{cellValue(f.enterprise)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── MOBILE CARDS ── */}
        <div className="cmp-mobile" aria-label="Mobile pricing cards">
          {plans.map((p) => (
            <div key={p.name} className={`cmp-mobile-card${p.featured ? ' cmp-mobile-card-featured' : ''}`}>
              <div className="cmp-mobile-header">
                <div className="cmp-mobile-title-row">
                  <span className="cmp-mobile-name">{p.name}</span>
                  {p.featured && <span className="cmp-popular-badge cmp-popular-badge-sm">Most Popular</span>}
                </div>
                <div className="cmp-mobile-price-row">
                  <span className="cmp-mobile-price">${p.price}</span>
                  <span className="cmp-mobile-period">{p.period}</span>
                </div>
                <p className="cmp-mobile-desc">{p.description}</p>
              </div>
              <div className="cmp-mobile-body">
                {categories.map((cat) => (
                  <div key={cat.name} className="cmp-mobile-cat">
                    <span className="cmp-mobile-cat-title">{cat.name}</span>
                    {cat.features.map((feat) => (
                      <div key={feat.name} className="cmp-mobile-row">
                        <span className="cmp-mobile-feat">{feat.name}</span>
                        <div className="cmp-mobile-val">{cellValue(feat[p.name.toLowerCase()])}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Link to={p.href} className={`cmp-btn ${p.featured ? 'cmp-btn-gradient' : 'cmp-btn-outline'} cmp-btn-mobile`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* ── LEGEND ── */}
        <div className="cmp-legend-wrap">
          <div className="cmp-legend">
            <span className="cmp-legend-item">
              <span className="cmp-icon cmp-check cmp-legend-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
              Included
            </span>
            <span className="cmp-legend-item">
              <span className="cmp-icon cmp-limited cmp-legend-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg></span>
              Limited
            </span>
            <span className="cmp-legend-item">
              <span className="cmp-icon cmp-x cmp-legend-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
              Not Available
            </span>
          </div>
          <p className="cmp-security">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            All plans include enterprise-grade security and 99.9% uptime SLA.
          </p>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, features, previewData } from '../../../data/productShowcase';
import CategoryTabs from './CategoryTabs';
import FeatureCard from './FeatureCard';
import ProductPreview from './ProductPreview';
import './ProductShowcase.css';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const prefersReduced = useReducedMotion();

  const currentFeatures = features[activeTab] || features.dashboard;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <section className="showcase-section" id="product-showcase" aria-label="Product showcase">
      {/* Decorative elements */}
      <div className="showcase-bg-glow showcase-bg-glow-1" aria-hidden="true" />
      <div className="showcase-bg-glow showcase-bg-glow-2" aria-hidden="true" />
      <div className="showcase-grid" aria-hidden="true" />
      <div className="showcase-radial" aria-hidden="true" />

      <motion.div
        className="container showcase-container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Section Header — full width, centered */}
        <motion.div className="showcase-header" variants={titleVariants}>
          <div className="showcase-badge">
            <span className="badge-dot" aria-hidden="true" />
            <span>PRODUCT EXPERIENCE</span>
          </div>
          <h2 className="section-title showcase-title">
            See FlowSync in Action
          </h2>
          <p className="section-subtitle showcase-subtitle">
            Explore how FlowSync helps teams manage projects, automate workflows, analyze performance, and collaborate effortlessly.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          prefersReduced={prefersReduced}
        />

        {/* Content Area */}
        <div className="showcase-content">
          {/* Left: Feature Cards */}
          <motion.div
            className="showcase-features"
            key={`features-${activeTab}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="list"
            aria-label="Product features"
          >
            {currentFeatures.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={i}
                prefersReduced={prefersReduced}
              />
            ))}
          </motion.div>

          {/* Right: Product Preview */}
          <div className="showcase-visual">
            <ProductPreview
              categoryId={activeTab}
              prefersReduced={prefersReduced}
            />
            <motion.p
              className="showcase-description"
              key={`desc-${activeTab}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            ></motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
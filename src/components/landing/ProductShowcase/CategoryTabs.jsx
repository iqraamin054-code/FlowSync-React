import { motion } from 'framer-motion';

const tabVariants = {
  inactive: { opacity: 0.6, scale: 1 },
  active: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const underlineVariants = {
  inactive: { scaleX: 0, opacity: 0 },
  active: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CategoryTabs({ categories, activeTab, onTabChange, prefersReduced }) {
  return (
    <div className="showcase-tabs" role="tablist" aria-label="Product categories">
      {categories.map((cat) => {
        const isActive = activeTab === cat.id;
        return (
          <motion.button
            key={cat.id}
            role="tab"
            id={`tab-${cat.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${cat.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`showcase-tab${isActive ? ' showcase-tab-active' : ''}`}
            onClick={() => onTabChange(cat.id)}
            onKeyDown={(e) => {
              const idx = categories.findIndex((c) => c.id === activeTab);
              let nextIdx;
              if (e.key === 'ArrowRight') {
                nextIdx = (idx + 1) % categories.length;
                onTabChange(categories[nextIdx].id);
                document.getElementById(`tab-${categories[nextIdx].id}`)?.focus();
              } else if (e.key === 'ArrowLeft') {
                nextIdx = (idx - 1 + categories.length) % categories.length;
                onTabChange(categories[nextIdx].id);
                document.getElementById(`tab-${categories[nextIdx].id}`)?.focus();
              } else if (e.key === 'Home') {
                onTabChange(categories[0].id);
                document.getElementById(`tab-${categories[0].id}`)?.focus();
              } else if (e.key === 'End') {
                onTabChange(categories[categories.length - 1].id);
                document.getElementById(`tab-${categories[categories.length - 1].id}`)?.focus();
              }
            }}
            variants={tabVariants}
            animate={isActive ? 'active' : 'inactive'}
            whileHover={
              prefersReduced || isActive
                ? {}
                : { opacity: 0.85, scale: 1.02 }
            }
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="showcase-tab-label">{cat.label}</span>
            {isActive && (
              <motion.span
                className="showcase-tab-underline"
                layoutId="tab-underline"
                variants={underlineVariants}
                initial="inactive"
                animate="active"
                aria-hidden="true"
              />
            )}
            {isActive && <span className="showcase-tab-glow" aria-hidden="true" />}
          </motion.button>
        );
      })}
    </div>
  );
}
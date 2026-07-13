import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqItems } from '../../data/faq';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);
  const buttonRefs = useRef([]);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq(index);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % faqItems.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + faqItems.length) % faqItems.length;
      buttonRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[faqItems.length - 1]?.focus();
    }
  };

  return (
    <section className="faq-section reveal" id="faq">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-primary">FAQ</span>
          <h2 className="section-title section-title-center">Frequently asked questions</h2>
          <p className="section-desc">
            Everything you need to know about FlowSync. Can't find what you're looking for?{' '}
            <a href="#contact" className="link">Reach out to us.</a>
          </p>
        </div>

        <div className="faq-list" role="list">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className={`faq-item${activeIndex === index ? ' active' : ''}`}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => { buttonRefs.current[index] = el; }}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                {item.question}
                <motion.svg
                  className="faq-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

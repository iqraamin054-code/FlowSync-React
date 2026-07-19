import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Sarah Kim',
    role: 'CTO, Lumora Technologies',
    avatar: 'SK',
    text: 'FlowSync transformed how our remote team collaborates. We went from 50 emails a day to zero — everything is in one place.',
  },
  {
    name: 'Marcus Reed',
    role: 'VP Eng, DataPulse Inc.',
    avatar: 'MR',
    text: 'The analytics alone saved us hours every week. We can finally see our entire business performance in one dashboard.',
  },
  {
    name: 'Aiko Tanaka',
    role: 'PM Lead, NexGen Solutions',
    avatar: 'AT',
    text: 'We evaluated six platforms before choosing FlowSync. Nothing else came close in terms of automation and ease of use.',
  },
];

const StarIcon = () => (
  <svg className="tst-star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 .001 0 .001 0 0z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const SLIDE_INTERVAL = 6000;
const SWIPE_THRESHOLD = 50;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = useCallback((index, dir) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 550);
  }, [isAnimating]);

  const next = useCallback(() => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    goToSlide(nextIndex, 1);
  }, [activeIndex, goToSlide]);

  const prev = useCallback(() => {
    const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    goToSlide(prevIndex, -1);
  }, [activeIndex, goToSlide]);

  // Auto-slide
  useEffect(() => {
    if (isPaused || isAnimating) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, isAnimating, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  };

  const handleDotClick = (index) => {
    if (index === activeIndex || isAnimating) return;
    const dir = index > activeIndex ? 1 : -1;
    goToSlide(index, dir);
  };

  const slideStyle = {
    transform: `translateX(calc(-${activeIndex * 100}% + ${direction * 0}px))`,
    transition: 'transform 550ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <section
      ref={sectionRef}
      className="tst-section reveal"
      id="testimonials"
      aria-label="Testimonials"
    >
      <div className="tst-glow" aria-hidden="true" />

      <div className="tst-inner">
        <motion.div
          className="tst-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <span className="tst-badge">
            <span className="tst-badge-icon" aria-hidden="true">💬</span>
            Loved by Growing Teams
          </span>
          <h2 className="tst-title">Trusted by teams building faster every day.</h2>
          <p className="tst-desc">Thousands of startups, agencies, and businesses use FlowSync to organize work, automate processes, and collaborate more efficiently.</p>
        </motion.div>

        <div
          className="tst-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Testimonial carousel"
          aria-roledescription="carousel"
        >
          <div className="tst-viewport">
            <div className="tst-track" style={slideStyle}>
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className="tst-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${i + 1} of ${testimonials.length}`}
                >
                  <article
                    className="tst-card"
                    tabIndex={0}
                    aria-label={`Testimonial from ${t.name}, ${t.role}`}
                  >
                    <div className="tst-stars" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon key={j} />
                      ))}
                    </div>

                    <div className="tst-quote-icon" aria-hidden="true">
                      <QuoteIcon />
                    </div>

                    <blockquote className="tst-review">
                      {t.text}
                    </blockquote>

                    <footer className="tst-author">
                      <div className="tst-avatar-wrap">
                        <div className="tst-avatar">{t.avatar}</div>
                      </div>
                      <div className="tst-info">
                        <span className="tst-name">{t.name}</span>
                        <span className="tst-role">{t.role}</span>
                      </div>
                    </footer>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tst-controls">
          <button
            className="tst-nav-btn"
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <PrevIcon />
          </button>

          <div className="tst-dots" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`tst-dot${i === activeIndex ? ' active' : ''}`}
                onClick={() => handleDotClick(i)}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to testimonial ${i + 1}`}
                tabIndex={i === activeIndex ? 0 : -1}
              />
            ))}
          </div>

          <button
            className="tst-nav-btn"
            onClick={next}
            aria-label="Next testimonial"
          >
            <NextIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

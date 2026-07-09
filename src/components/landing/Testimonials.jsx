import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    { name: 'Sarah Kim', role: 'CTO, Lumora Technologies', avatar: 'SK', text: '"FlowSync transformed how our remote team collaborates. We went from 50 emails a day to zero — everything is in one place."' },
    { name: 'Marcus Reed', role: 'VP Eng, DataPulse Inc.', avatar: 'MR', text: '"The analytics alone saved us hours every week. We can finally see our entire business performance in one dashboard."' },
    { name: 'Aiko Tanaka', role: 'PM Lead, NexGen Solutions', avatar: 'AT', text: '"We evaluated six platforms before choosing FlowSync. Nothing else came close in terms of automation and ease of use."' },
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  return (
    <section className="testimonials-section reveal" id="testimonials">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-secondary">Testimonials</span>
          <h2 className="section-title section-title-center">Loved by teams worldwide</h2>
          <p className="section-desc">Hear from the companies that use FlowSync to move faster every day.</p>
        </div>

        <div
          className="testimonials-carousel reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="carousel-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="testimonial-card testimonial-card--featured"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">{testimonials[current].text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonials[current].avatar}</div>
                  <div className="testimonial-info">
                    <span className="testimonial-name">{testimonials[current].name}</span>
                    <span className="testimonial-role">{testimonials[current].role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prev} aria-label="Previous testimonial">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className="carousel-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`carousel-dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <button className="carousel-btn" onClick={next} aria-label="Next testimonial">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

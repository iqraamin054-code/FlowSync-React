import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function BlogModal({ post, onClose }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const timer = setTimeout(() => modalRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const badgeClass = {
    Product: 'badge-primary',
    Engineering: 'badge-success',
    Company: 'badge-secondary',
  };

  const readTime = `${3 + Math.floor(post.fullBody.length / 800)} min read`;

  return (
    <AnimatePresence>
      <motion.div
        className="blog-modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="blog-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          ref={modalRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <button className="blog-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="blog-modal-content">
            <div className="blog-modal-hero">
              <img src={post.image} alt={post.title} loading="lazy" />
              <div className="blog-modal-hero-overlay" />
            </div>

            <div className="blog-modal-body">
              <span className={`badge ${badgeClass[post.category] || 'badge-secondary'}`}>
                {post.category}
              </span>

              <h2 className="blog-modal-title">{post.title}</h2>

              <div className="blog-modal-meta">
                <div className="blog-modal-author">
                  <div className="blog-modal-avatar">FS</div>
                  <span>FlowSync Team</span>
                </div>
                <span className="blog-modal-meta-sep">·</span>
                <span>Jan 15, 2026</span>
                <span className="blog-modal-meta-sep">·</span>
                <span>{readTime}</span>
              </div>

              <div className="blog-modal-article">
                {post.fullBody.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <button className="blog-modal-back-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                </svg>
                Back to Blogs
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

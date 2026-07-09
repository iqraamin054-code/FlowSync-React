import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;

const validate = (fields) => {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required';
  if (!fields.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email';
  if (!fields.message.trim()) errors.message = 'Message is required';
  else if (fields.message.trim().length < MIN_MESSAGE) errors.message = `At least ${MIN_MESSAGE} characters`;
  return errors;
};

function FloatingInput({ label, id, name, type = 'text', value, onChange, error, required, placeholder }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className={`contact-float-field${error ? ' contact-float-field--error' : ''}`}>
      <input
        id={id}
        name={name}
        type={type}
        className="contact-float-input"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label htmlFor={id} className={`contact-float-label${active ? ' active' : ''}`}>{label}</label>
      <div className="contact-float-border" />
      <AnimatePresence>
        {error && (
          <motion.span
            id={`${id}-error`}
            className="contact-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingTextarea({ label, id, name, value, onChange, error, required, placeholder, maxLength }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const remaining = maxLength - value.length;

  return (
    <div className={`contact-float-field${error ? ' contact-float-field--error' : ''}`}>
      <textarea
        id={id}
        name={name}
        className="contact-float-input contact-float-textarea"
        rows="5"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label htmlFor={id} className={`contact-float-label${active ? ' active' : ''}`}>{label}</label>
      <div className="contact-float-border" />
      <div className="contact-textarea-footer">
        <AnimatePresence>
          {error && (
            <motion.span
              id={`${id}-error`}
              className="contact-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              role="alert"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
        <span className={`contact-char-count${remaining < 50 ? ' low' : ''}`}>{value.length}/{maxLength}</span>
      </div>
    </div>
  );
}

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFields({ name: '', email: '', company: '', subject: '', message: '' });
    setErrors({});
  };

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-header">
          <motion.span className="badge badge-primary" {...fadeUp} transition={{ duration: 0.4 }}>Contact</motion.span>
          <motion.h2 className="section-title section-title-center" id="contact-heading" {...fadeUp} transition={{ duration: 0.4, delay: 0.08 }}>Get in touch</motion.h2>
          <motion.p className="section-desc" {...fadeUp} transition={{ duration: 0.4, delay: 0.16 }}>Have a question or want to work together? Drop us a message.</motion.p>
        </div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Email</span>
                <span className="contact-info-value">hello@flowsync.io</span>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Location</span>
                <span className="contact-info-value">San Francisco, CA</span>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Business Hours</span>
                <span className="contact-info-value">Mon – Fri, 9am – 6pm PST</span>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Response Time</span>
                <span className="contact-info-value">Within 24 hours</span>
              </div>
            </div>

            <div className="contact-socials">
              <a href="#" className="contact-social" aria-label="Twitter">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="contact-social" aria-label="GitHub">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              </a>
              <a href="#" className="contact-social" aria-label="LinkedIn">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="contact-success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </motion.div>
                  <h3 className="contact-success-title">Message sent!</h3>
                  <p className="contact-success-text">We'll get back to you within 24 hours.</p>
                  <button className="btn btn-secondary" onClick={resetForm}>Send another</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                >
                  <div className="contact-form-row">
                    <FloatingInput label="Name *" id="contact-name" name="name" value={fields.name} onChange={handleChange} error={errors.name} required placeholder=" " />
                    <FloatingInput label="Email *" id="contact-email" name="email" type="email" value={fields.email} onChange={handleChange} error={errors.email} required placeholder=" " />
                  </div>
                  <div className="contact-form-row">
                    <FloatingInput label="Company" id="contact-company" name="company" value={fields.company} onChange={handleChange} placeholder=" " />
                    <FloatingInput label="Subject" id="contact-subject" name="subject" value={fields.subject} onChange={handleChange} placeholder=" " />
                  </div>
                  <FloatingTextarea label="Message *" id="contact-message" name="message" value={fields.message} onChange={handleChange} error={errors.message} required placeholder=" " maxLength={MAX_MESSAGE} />
                  <button type="submit" className="btn btn-primary btn-lg contact-submit" disabled={submitting}>
                    {submitting ? (
                      <span className="contact-submit-loading">
                        <span className="contact-spinner" aria-hidden="true" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

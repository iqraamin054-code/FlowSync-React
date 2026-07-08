import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const validate = (fields) => {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required';
  if (!fields.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email';
  if (!fields.message.trim()) errors.message = 'Message is required';
  return errors;
};

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  return (
    <section className="contact-section reveal" id="contact">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-primary">Contact</span>
          <h2 className="section-title section-title-center">Get in touch</h2>
          <p className="section-desc">Have a question or want to work together? Drop us a message.</p>
        </div>

        <div className="contact-grid reveal">
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Email</span>
                <span className="contact-info-value">hello@flowsync.io</span>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <span className="contact-info-label">Location</span>
                <span className="contact-info-value">San Francisco, CA</span>
              </div>
            </div>
            <div className="contact-socials">
              <a href="#" className="contact-social" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="contact-social" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              </a>
              <a href="#" className="contact-social" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="contact-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h3 className="contact-success-title">Message sent!</h3>
                <p className="contact-success-text">We'll get back to you within 24 hours.</p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setFields({ name: '', email: '', message: '' }); }}>Send another</button>
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
                <div className="contact-field">
                  <label htmlFor="contact-name" className="contact-label">Name</label>
                  <input id="contact-name" name="name" type="text" className={`contact-input${errors.name ? ' contact-input--error' : ''}`} placeholder="Your name" value={fields.name} onChange={handleChange} />
                  {errors.name && <span className="contact-error">{errors.name}</span>}
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email" className="contact-label">Email</label>
                  <input id="contact-email" name="email" type="email" className={`contact-input${errors.email ? ' contact-input--error' : ''}`} placeholder="you@company.com" value={fields.email} onChange={handleChange} />
                  {errors.email && <span className="contact-error">{errors.email}</span>}
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-message" className="contact-label">Message</label>
                  <textarea id="contact-message" name="message" rows="5" className={`contact-input contact-textarea${errors.message ? ' contact-input--error' : ''}`} placeholder="How can we help?" value={fields.message} onChange={handleChange} />
                  {errors.message && <span className="contact-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary btn-lg contact-submit">Send Message</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

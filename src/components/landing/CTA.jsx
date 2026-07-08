import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="cta-section reveal" id="cta">
      <div className="container">
        <div className="cta-card reveal">
          <div className="cta-glow"></div>
          <div className="badge badge-primary">Get Started</div>
          <h2 className="cta-title">Ready to transform your workflow?</h2>
          <p className="cta-desc">Join 5,000+ teams that trust FlowSync to streamline their projects, automate their work, and grow their business.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" className="cta-input" placeholder="Enter your work email" required aria-label="Email address" />
            <Link to="/onboarding" className="btn btn-primary">Start Free Trial</Link>
          </form>
          <p className="cta-note">No credit card required. Free 14-day trial.</p>
          <div className="cta-buttons">
            <button className="btn btn-secondary">Book a Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}

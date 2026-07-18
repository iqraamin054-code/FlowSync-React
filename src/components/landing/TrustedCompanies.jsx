import './Hero/Hero.css';
import { trustedCompanies } from '../../data/landingContent';

const companyIcons = {
  google: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  spotify: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1DB954" />
      <path d="M7.5 13.5c3-1.5 6-.5 9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M6 11c3.5-1.5 7-.5 10 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M9 16c2-1 4-.5 5.5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  slack: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="7" height="2.5" rx="1.2" fill="#E01E5A" />
      <rect x="4" y="4" width="2.5" height="7" rx="1.2" fill="#E01E5A" />
      <rect x="13" y="4" width="7" height="2.5" rx="1.2" fill="#36C5F0" />
      <rect x="17.5" y="4" width="2.5" height="7" rx="1.2" fill="#36C5F0" />
      <rect x="4" y="13" width="7" height="2.5" rx="1.2" fill="#2EB67D" />
      <rect x="4" y="17.5" width="2.5" height="7" rx="1.2" fill="#2EB67D" />
      <rect x="13" y="13" width="7" height="2.5" rx="1.2" fill="#ECB22E" />
      <rect x="17.5" y="13" width="2.5" height="7" rx="1.2" fill="#ECB22E" />
    </svg>
  ),
  microsoft: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="#F25022" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="#7FBA00" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="#00A4EF" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="#FFB900" />
    </svg>
  ),
  notion: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="4" fill="white" />
      <path d="M7 6v12M17 6v12" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  netflix: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 2L4 22L12 10L12 22L20 10L20 2L12 14L12 2Z" fill="#E50914" />
    </svg>
  ),
  adobe: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2L2 22h5.5l2.5-6h4l2.5 6H22L12 2z" fill="#FF0000" />
    </svg>
  ),
  github: (
    <svg className="marquee-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.22.682-.48v-1.71c-2.782.6-3.37-1.34-3.37-1.34-.454-1.16-1.11-1.47-1.11-1.47-.908-.62.07-.61.07-.61 1.004.07 1.53 1.03 1.53 1.03.893 1.52 2.341 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.68.48C19.138 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10z" fill="white" />
    </svg>
  ),
};

export default function TrustedCompanies() {
  const repeated = [...trustedCompanies, ...trustedCompanies];

  return (
    <section className="trusted">
      <div className="container">
        <div className="trusted-divider" />
        <p className="trusted-label">Trusted by innovative teams at</p>
        <div className="marquee" role="list" aria-label="Trusted companies">
          <div className="marquee-track">
            {repeated.map((company, index) => (
              <div className="marquee-item" role="listitem" key={`${company.name}-${index}`}>
                {companyIcons[company.icon]}
                <span className="marquee-name">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

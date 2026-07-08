import './Hero/Hero.css';
import { problems } from '../../data/landingContent';

const iconMap = {
  grid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="2" y1="15" x2="22" y2="15" />
    </svg>
  ),
  bolt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  bars: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
};

const hoverStateMap = {
  projects: 'default',
  automation: 'automation',
  analytics: 'analytics',
};

const dataHoverMap = {
  'Scattered Work': 'projects',
  'Manual Processes': 'automation',
  'Limited Visibility': 'analytics',
};

export default function Problems({ onHover }) {
  return (
    <section className="problems-section reveal" id="why-switch">
      <div className="problems-glow problems-glow-1" />
      <div className="problems-glow problems-glow-2" />

      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-secondary section-badge">THE PROBLEM</span>
          <h2 className="section-title section-title-center">Work shouldn't feel this complicated.</h2>
          <p className="section-desc">
            Growing teams juggle multiple apps just to communicate, manage projects, assign tasks, track progress,
            and analyze performance. Too many disconnected tools create unnecessary complexity, slow collaboration,
            and reduce productivity.
          </p>
        </div>

        <div className="problems-grid reveal-stagger">
          {problems.map((problem) => (
            <div
              className="problem-card reveal"
              data-hover={dataHoverMap[problem.title] || problem.title.toLowerCase()}
              tabIndex="0"
              key={problem.title}
              onMouseEnter={() => onHover?.(hoverStateMap[dataHoverMap[problem.title]] || 'default')}
              onMouseLeave={() => onHover?.('default')}
            >
              <div className="problem-icon">{iconMap[problem.icon]}</div>
              <h3 className="problem-title">{problem.title}</h3>
              <p className="problem-desc">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

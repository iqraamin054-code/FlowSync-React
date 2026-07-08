import { useRef, useEffect } from 'react';
import './Hero/Hero.css';
import { statistics } from '../../data/landingContent';

export default function Statistics() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const counters = grid.querySelectorAll('.stat-num');
    if (!counters.length) return;

    let animated = false;
    const animateCounters = () => {
      if (animated) return;
      animated = true;
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        const isDecimal = target % 1 !== 0;
        const step = Math.max(target / 60, isDecimal ? 0.1 : 1);
        let current = 0;
        const update = () => {
          current += step;
          if (current >= target) {
            counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
            return;
          }
          counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
          requestAnimationFrame(update);
        };
        update();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(grid);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section reveal" id="stats">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-primary">By the Numbers</span>
          <h2 className="section-title section-title-center">Trusted by teams that ship</h2>
          <p className="section-desc">FlowSync powers productivity for thousands of companies worldwide.</p>
        </div>

        <div className="stats-grid reveal-stagger" ref={gridRef}>
          {statistics.map((stat) => (
            <div className="stat-card reveal" key={stat.label}>
              <span className="stat-num" data-target={stat.value}>0</span>
              <span className={stat.suffix === '%' ? 'stat-pct' : 'stat-plus'}>{stat.suffix}</span>
              <span className="stat-label-card">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

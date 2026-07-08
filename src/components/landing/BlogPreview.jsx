import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.12 },
  }),
};

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://dummyjson.com/posts?limit=3', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts.map((p, i) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          category: ['Product', 'Engineering', 'Company'][i % 3],
          image: `https://picsum.photos/seed/flow${p.id}/600/340`,
        })));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const colors = { Product: 'badge-primary', Engineering: 'badge-success', Company: 'badge-secondary' };

  return (
    <section className="blog-section reveal" id="blog">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-secondary">Blog</span>
          <h2 className="section-title section-title-center">Latest from FlowSync</h2>
          <p className="section-desc">Insights, updates, and tips for your team.</p>
        </div>

        {loading && (
          <div className="blog-loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="blog-card blog-card--skeleton">
                <div className="blog-skeleton-img shimmer" />
                <div className="blog-skeleton-body">
                  <div className="blog-skeleton-badge shimmer" />
                  <div className="blog-skeleton-title shimmer" />
                  <div className="blog-skeleton-text shimmer" />
                  <div className="blog-skeleton-text shimmer short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="blog-error">
            <p>Unable to load blog posts. Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="blog-grid reveal-stagger">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                className="blog-card reveal"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="blog-card-image">
                  <img src={post.image} alt="" loading="lazy" />
                </div>
                <div className="blog-card-body">
                  <span className={`badge ${colors[post.category]}`}>{post.category}</span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-desc">{post.body.slice(0, 120)}...</p>
                  <button className="blog-card-link">
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

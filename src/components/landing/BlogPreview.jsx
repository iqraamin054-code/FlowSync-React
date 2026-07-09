import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogModal from './BlogModal';
import productImg from '../../assets/images/product.webp';
import engineeringImg from '../../assets/images/engineering.webp';
import companyImg from '../../assets/images/companyblog.webp';

const categoryImages = {
  Product: productImg,
  Engineering: engineeringImg,
  Company: companyImg,
};

const blogPosts = [
  {
    id: 1,
    title: 'How FlowSync Revolutionizes Team Collaboration',
    body: 'Discover how FlowSync brings your entire team together with real-time collaboration tools that keep everyone on the same page.',
    category: 'Product',
    image: categoryImages.Product,
    fullBody: `Collaboration is the backbone of every successful team. Yet, most teams struggle with scattered tools, missed messages, and disorganized workflows. FlowSync was built to solve exactly that.

With FlowSync, your team gets a single hub for tasks, messages, and file sharing. No more switching between five different apps. Everything you need is in one place.

Real-time updates ensure that every team member sees changes instantly. Whether you are assigning tasks, reviewing progress, or sharing feedback, FlowSync keeps everyone aligned.

Our users report a 40% increase in productivity within the first month. That is not just a number — it is hours saved, deadlines met, and teams working in harmony.

FlowSync also integrates with the tools you already use. Connect your calendar, cloud storage, and communication platforms without any hassle.

Start your free trial today and experience the difference that a unified collaboration platform can make for your team.`,
  },
  {
    id: 2,
    title: 'Top 5 Productivity Tips for Remote Teams',
    body: 'Working remotely comes with unique challenges. Here are five proven strategies to keep your distributed team productive and engaged.',
    category: 'Engineering',
    image: categoryImages.Engineering,
    fullBody: `Remote work is here to stay. But managing a distributed team requires more than just a video call setup. Here are five strategies that actually work.

First, establish clear communication channels. Define where discussions happen — whether it is Slack for quick chats, email for formal updates, or FlowSync for task-related conversations.

Second, set transparent goals and deadlines. When everyone knows what is expected, there is less confusion and more focus. Use FlowSync's task boards to visualize progress.

Third, embrace asynchronous work. Not every conversation needs to be a meeting. Record updates, write detailed notes, and let team members contribute on their own schedule.

Fourth, schedule regular check-ins. A brief weekly sync keeps the team connected without overwhelming anyone's calendar. Keep it short, focused, and actionable.

Fifth, invest in the right tools. FlowSync combines task management, messaging, and file sharing into one seamless experience. The right platform eliminates friction and keeps your team moving forward.

Implement these strategies today and watch your remote team thrive.`,
  },
  {
    id: 3,
    title: 'Introducing FlowSync 2.0: What Is New',
    body: 'We are excited to announce FlowSync 2.0 with powerful new features designed to make your workflow smoother than ever.',
    category: 'Company',
    image: categoryImages.Company,
    fullBody: `Today marks a big milestone for FlowSync. We are thrilled to introduce FlowSync 2.0 — a complete redesign built around your feedback.

The new dashboard gives you a bird's eye view of all your projects. See what needs attention, track progress across teams, and identify bottlenecks before they become problems.

We have also added advanced reporting. Generate detailed insights on team performance, project timelines, and resource allocation with just a few clicks.

The redesigned task board supports custom workflows. Whether you follow Scrum, Kanban, or your own methodology, FlowSync adapts to the way you work.

Collaboration has never been easier. The new inline commenting feature lets you leave feedback directly on tasks, documents, and designs without switching context.

We have also improved performance across the board. Everything loads faster, syncing is smoother, and the entire experience feels more responsive.

FlowSync 2.0 is available now for all users. Log in to explore the new features and let us know what you think.`,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.12 },
  }),
};

export default function BlogPreview() {
  const [selectedPost, setSelectedPost] = useState(null);

  const colors = {
    Product: 'badge-primary',
    Engineering: 'badge-success',
    Company: 'badge-secondary',
  };

  return (
    <section className="blog-section reveal" id="blog">
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-secondary">Blog</span>
          <h2 className="section-title section-title-center">Latest from FlowSync</h2>
          <p className="section-desc">Insights, updates, and tips for your team.</p>
        </div>

        <div className="blog-grid reveal-stagger">
          {blogPosts.map((post, i) => (
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
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="blog-card-body">
                <span className={`badge ${colors[post.category]}`}>{post.category}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-desc">{post.body}</p>
                <button
                  className="blog-card-link"
                  onClick={() => setSelectedPost(post)}
                >
                  Read More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

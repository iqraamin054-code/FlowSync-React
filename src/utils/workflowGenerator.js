// Helper to create a task object
const createTask = (title, description, phase, priority, timeline, status = 'todo') => ({
  id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title,
  description,
  phase,
  priority,
  timeline,
  status,
});

/**
 * Local stand-in for a workflow generator.
 * Creates a structured set of tasks grouped into 6 standard phases.
 */
export function generateWorkflow(goal, targetDate) {
  const normalized = goal.toLowerCase();
  const isWebOrApp = /website|site|landing|app|software|code|platform|portal|system|design/i.test(normalized);
  const isMarketingOrLaunch = /campaign|marketing|launch|brand|social|ads|funnel|product/i.test(normalized);

  const formattedDate = targetDate 
    ? new Date(targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Flexible';

  if (isWebOrApp) {
    return [
      // Planning
      createTask('Define project scope & goals', 'Establish target audience, core features, and success metrics.', 'Planning', 'high', 'Day 1-3'),
      createTask('Conduct competitor research', 'Analyze similar platforms to find visual and UX patterns.', 'Planning', 'medium', 'Day 2-4'),
      // Design
      createTask('Create wireframes & sitemap', 'Map page relationships and plan layout grids.', 'Design', 'high', 'Day 5-8'),
      createTask('Design high-fidelity UI mockup', 'Establish color palettes, typography, and interactive states.', 'Design', 'high', 'Day 8-12'),
      // Development
      createTask('Set up dev environment & repo', 'Initialize project structure and set up version control.', 'Development', 'medium', 'Day 13-14'),
      createTask('Build core responsive layout', 'Code the base templates, navigation, and footer elements.', 'Development', 'high', 'Day 15-20'),
      createTask('Implement backend & forms', 'Wire up databases, server hooks, and contact forms.', 'Development', 'high', 'Day 20-25'),
      // Content
      createTask('Draft copy & headers', 'Write user-friendly content, calls to action, and SEO keywords.', 'Content', 'medium', 'Day 10-15'),
      createTask('Optimize media & images', 'Compress graphics, prepare icons, and verify licensing.', 'Content', 'low', 'Day 16-18'),
      // Testing
      createTask('Test responsiveness & forms', 'Verify layout on mobile/tablet and check email delivery.', 'Testing', 'high', 'Day 26-27'),
      createTask('Run site performance audits', 'Optimize load times, scripts, and lighthouse metrics.', 'Testing', 'medium', 'Day 27-28'),
      // Launch
      createTask('Deploy build to production', 'Publish code to hosting provider and verify domains.', 'Launch', 'high', `Target: ${formattedDate}`),
      createTask('Set up post-launch monitoring', 'Configure analytics, uptime checks, and error logs.', 'Launch', 'medium', 'Post-Launch'),
    ];
  } else if (isMarketingOrLaunch) {
    return [
      // Planning
      createTask('Establish campaign parameters', 'Define budget caps, target demographics, and KPI targets.', 'Planning', 'high', 'Day 1-2'),
      createTask('Formulate messaging strategy', 'Develop unique selling propositions and marketing pillars.', 'Planning', 'high', 'Day 2-4'),
      // Design
      createTask('Design ad banner concepts', 'Create graphical assets for social media and display networks.', 'Design', 'medium', 'Day 5-8'),
      createTask('Draft landing page wireframe', 'Design high-converting conversion page mockups.', 'Design', 'high', 'Day 6-9'),
      // Development
      createTask('Publish campaign landing page', 'Develop responsive page with lead forms and analytics.', 'Development', 'high', 'Day 10-14'),
      createTask('Configure automated emails', 'Set up drip sequences and autoresponders in CRM.', 'Development', 'high', 'Day 12-16'),
      // Content
      createTask('Write campaign ad copy', 'Draft persuasive headlines and body copy for promotions.', 'Content', 'medium', 'Day 7-10'),
      createTask('Schedule social media announcements', 'Create outreach schedule and brand announcements.', 'Content', 'low', 'Day 12-15'),
      // Testing
      createTask('Conduct form & pixel test', 'Ensure tracking triggers correctly on landing page forms.', 'Testing', 'high', 'Day 17-18'),
      createTask('Test email drip delivery', 'Send test broadcasts to review layout and formatting.', 'Testing', 'medium', 'Day 18-19'),
      // Launch
      createTask('Activate campaign pipelines', 'Unleash social and search ads with live budget allocations.', 'Launch', 'high', `Target: ${formattedDate}`),
      createTask('Monitor click & lead metrics', 'Observe conversion reports and adjust parameters.', 'Launch', 'medium', 'Daily'),
    ];
  } else {
    // General Project Template
    return [
      // Planning
      createTask('Align stakeholders & deliverables', 'Clarify core goals, roles, and major delivery stages.', 'Planning', 'high', 'Day 1-3'),
      createTask('Outline resource allocation', 'Budget expenses, software requirements, and personnel time.', 'Planning', 'medium', 'Day 3-5'),
      // Design
      createTask('Formulate execution blueprint', 'Draft specifications, user guides, or design patterns.', 'Design', 'high', 'Day 5-9'),
      // Development
      createTask('Construct initial milestones', 'Build out the primary physical or digital deliverables.', 'Development', 'high', 'Day 10-18'),
      createTask('Integrate auxiliary systems', 'Connect dependencies and ensure sub-systems align.', 'Development', 'medium', 'Day 18-22'),
      // Content
      createTask('Create user guide documentation', 'Write tutorials, FAQ documents, or project notes.', 'Content', 'medium', 'Day 14-20'),
      // Testing
      createTask('Perform thorough quality audit', 'Test reliability, edge cases, and user acceptance criteria.', 'Testing', 'high', 'Day 23-25'),
      // Launch
      createTask('Deliver final project package', 'Hand off artifacts to client or publish live release.', 'Launch', 'high', `Target: ${formattedDate}`),
      createTask('Conduct project retrospective', 'Assess metrics, performance feedback, and next steps.', 'Launch', 'low', 'Post-Project'),
    ];
  }
}

export function createProject({ name, goal, targetDate }) {
  return {
    id: `project-${Date.now()}`,
    name: name.trim() || 'Untitled Project',
    goal: goal.trim(),
    targetDate: targetDate || '',
    createdAt: new Date().toISOString(),
    tasks: generateWorkflow(goal, targetDate),
  };
}

export function getProjectProgress(tasks = []) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((item) => item.status === 'done').length / tasks.length) * 100);
}

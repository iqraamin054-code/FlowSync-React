const createTask = (title, description, phase, priority, timeline) => ({
  id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title,
  description,
  phase,
  priority,
  timeline,
  status: 'todo',
});

const atStartOfDay = (value) => {
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)))
    : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export function getAvailableDays(targetDate, today = new Date()) {
  if (!targetDate) return null;
  return Math.round((atStartOfDay(targetDate) - atStartOfDay(today)) / 86400000);
}

const template = (kind, compact) => {
  const templates = {
    website: compact ? [
      ['Define essential website requirements', 'Confirm the essential pages, audience, call to action, and launch criteria.', 'Planning', 'high'],
      ['Prepare website content and assets', 'Collect the copy, logo, images, contact details, and legal information needed to publish.', 'Content', 'high'],
      ['Complete the core website implementation', 'Build the required pages, navigation, responsive layout, and contact flow.', 'Development', 'high'],
      ['Test critical pages and functionality', 'Check mobile layout, links, forms, and the main customer journey.', 'Testing', 'high'],
      ['Deploy the website', 'Publish the site, verify the domain, and complete final launch checks.', 'Launch', 'high'],
    ] : [
      ['Define website requirements', 'Clarify the audience, essential pages, features, and launch success criteria.', 'Planning', 'high'],
      ['Create sitemap and page plan', 'Map navigation, page hierarchy, and the content needed for each page.', 'Design', 'high'],
      ['Design key page layouts', 'Establish a clear visual direction for the homepage and essential pages.', 'Design', 'medium'],
      ['Build the responsive website', 'Implement pages, navigation, forms, and core interactions.', 'Development', 'high'],
      ['Prepare website content and assets', 'Write copy and prepare branded images, calls to action, and metadata.', 'Content', 'medium'],
      ['Test pages and forms', 'Validate responsiveness, links, forms, accessibility, and browser behaviour.', 'Testing', 'high'],
      ['Deploy and verify the launch', 'Publish the build and verify the domain and key customer flows.', 'Launch', 'high'],
    ],
    mobile: compact ? [
      ['Define the essential app experience', 'Choose the user, core use case, and the minimum features required for release.', 'Planning', 'high'],
      ['Design the core app screens', 'Create the primary mobile screens and navigation required for the first release.', 'Design', 'high'],
      ['Implement the core app features', 'Build the tracking, data, and interaction flow required for the goal.', 'Development', 'high'],
      ['Test and prepare the release', 'Test critical devices and prepare the build, store assets, and release notes.', 'Testing', 'high'],
      ['Release the mobile app', 'Publish the build and monitor the initial user experience.', 'Launch', 'high'],
    ] : [
      ['Plan the app and target users', 'Define the app outcome, audience, core user journey, and release criteria.', 'Planning', 'high'],
      ['Prioritize core app features', 'Choose the smallest useful feature set for the initial release.', 'Planning', 'high'],
      ['Design mobile UI screens', 'Create the primary screens, states, navigation, and accessibility treatment.', 'Design', 'high'],
      ['Build core app functionality', 'Implement the core data, interaction, and mobile experience.', 'Development', 'high'],
      ['Prepare app content and store assets', 'Write onboarding copy, prepare screenshots, icons, and release notes.', 'Content', 'medium'],
      ['Test the app on target devices', 'Validate critical flows, edge cases, and device compatibility.', 'Testing', 'high'],
      ['Prepare and release the app', 'Create the release build and complete store or distribution checks.', 'Launch', 'high'],
    ],
    marketing: compact ? [
      ['Define campaign audience and message', 'Set the offer, target audience, channels, and the single campaign objective.', 'Planning', 'high'],
      ['Create campaign content', 'Produce the essential social posts, visuals, and call to action.', 'Content', 'high'],
      ['Set up campaign channels', 'Prepare the landing page, tracking, audience settings, and publishing schedule.', 'Development', 'high'],
      ['Review links and tracking', 'Test links, forms, tracking, and message consistency before launch.', 'Testing', 'high'],
      ['Launch and monitor the campaign', 'Publish the campaign and monitor initial reach, engagement, and responses.', 'Launch', 'high'],
    ] : [
      ['Define campaign strategy', 'Set the audience, offer, channels, budget boundaries, and success metrics.', 'Planning', 'high'],
      ['Create campaign concept and calendar', 'Plan messages, visual direction, publishing dates, and approvals.', 'Design', 'medium'],
      ['Produce campaign content', 'Create posts, visuals, copy, and calls to action for each channel.', 'Content', 'high'],
      ['Set up landing and tracking', 'Prepare campaign destinations, analytics, forms, and audience settings.', 'Development', 'high'],
      ['Schedule and quality-check the campaign', 'Verify links, timing, tracking, and all campaign assets.', 'Testing', 'high'],
      ['Launch and optimize the campaign', 'Publish, monitor results, and record the first improvement opportunities.', 'Launch', 'high'],
    ],
    general: compact ? [
      ['Define the essential outcome', 'Clarify the smallest practical result, audience, and completion criteria.', 'Planning', 'high'],
      ['Prepare the required materials', 'Collect the information, people, tools, and assets needed to deliver.', 'Design', 'high'],
      ['Complete the core work', 'Focus on the most important deliverable required to achieve the goal.', 'Development', 'high'],
      ['Review and test the result', 'Check quality, feedback, and the critical requirements before delivery.', 'Testing', 'high'],
      ['Deliver and confirm completion', 'Hand off or publish the result and confirm the next action.', 'Launch', 'high'],
    ] : [
      ['Define scope and success criteria', 'Clarify the goal, audience, expected outcome, owners, and success measures.', 'Planning', 'high'],
      ['Create the delivery plan', 'Break the work into milestones, dependencies, and review points.', 'Planning', 'high'],
      ['Prepare the execution approach', 'Create the specification, design, or plan needed to begin confidently.', 'Design', 'high'],
      ['Complete the core deliverables', 'Produce the primary work and keep the agreed milestones moving.', 'Development', 'high'],
      ['Prepare supporting content and assets', 'Create the content, documentation, or materials required for delivery.', 'Content', 'medium'],
      ['Review and test quality', 'Validate the work, collect feedback, and resolve remaining issues.', 'Testing', 'high'],
      ['Launch and hand off', 'Release the completed work, communicate the handoff, and capture next actions.', 'Launch', 'high'],
    ],
  };
  return templates[kind];
};

const scheduleTasks = (items, targetDate) => {
  const availableDays = getAvailableDays(targetDate);
  if (availableDays === null) return items.map((item, index) => ({ ...item, timeline: `Suggested step ${index + 1}` }));
  const start = atStartOfDay(new Date());
  return items.map((item, index) => {
    const offset = items.length === 1 ? availableDays : Math.round((index / (items.length - 1)) * availableDays);
    const scheduled = new Date(start);
    scheduled.setDate(start.getDate() + offset);
    const dateLabel = scheduled.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return { ...item, timeline: offset === 0 ? `Today · ${dateLabel}` : `Day ${offset} · ${dateLabel}` };
  });
};

export function generateWorkflow(goal, targetDate = '', projectName = '') {
  const text = `${projectName} ${goal}`.toLowerCase();
  const kind = /mobile|ios|android|fitness.*app|app/.test(text) ? 'mobile'
    : /campaign|marketing|social media|ads|brand/.test(text) ? 'marketing'
      : /website|site|landing|web/.test(text) ? 'website' : 'general';
  const availableDays = getAvailableDays(targetDate);
  const compact = availableDays !== null && availableDays <= 2;
  return scheduleTasks(template(kind, compact).map(([title, description, phase, priority]) => ({ title, description, phase, priority })), targetDate)
    .map((item) => createTask(item.title, item.description, item.phase, item.priority, item.timeline));
}

export function createProject({ name, goal, targetDate }) {
  const timestamp = new Date().toISOString();
  return { id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: name.trim() || 'Untitled Project', goal: goal.trim(), targetDate: targetDate || '', createdAt: timestamp, updatedAt: timestamp, tasks: generateWorkflow(goal, targetDate, name) };
}

export function getProjectProgress(tasks = []) {
  return tasks.length ? Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100) : 0;
}

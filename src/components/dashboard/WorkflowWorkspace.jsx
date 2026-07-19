import { useState, useEffect, useRef } from 'react';
import useWorkflowProject from '../../hooks/useWorkflowProject.js';
import { getProjectProgress } from '../../utils/workflowGenerator.js';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Complete' },
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const PHASES = ['Planning', 'Design', 'Development', 'Content', 'Testing', 'Launch'];

export default function WorkflowWorkspace() {
  const { project, startProject, updateTask, deleteProject } = useWorkflowProject();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState({
    Planning: true,
    Design: true,
    Development: true,
    Content: true,
    Testing: true,
    Launch: true,
  });

  const goalInputRef = useRef(null);

  // Focus the goal textarea when the creation form is displayed
  useEffect(() => {
    if (showCreateForm && goalInputRef.current) {
      goalInputRef.current.focus();
    }
  }, [showCreateForm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!goal.trim()) return;
    startProject({ name, goal, targetDate });
    // Reset form fields
    setName('');
    setGoal('');
    setTargetDate('');
    setShowCreateForm(false);
  };

  const togglePhase = (phase) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phase]: !prev[phase],
    }));
  };

  if (!project) {
    return (
      <section className="workflow-empty" aria-labelledby="workflow-title">
        {!showCreateForm ? (
          <div className="workflow-empty__intro">
            <span className="workflow-kicker">Start your journey</span>
            <h1 id="workflow-title">Ready to turn an idea into a plan?</h1>
            <p className="workflow-empty-desc">
              Enter a project goal and FlowSync will help structure the work into actionable tasks.
            </p>
            <button 
              className="workflow-primary create-project-btn ripple" 
              onClick={() => setShowCreateForm(true)}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="workflow-create-container">
            <div className="workflow-empty__copy">
              <span className="workflow-kicker">New Project Setup</span>
              <h2>Describe your objective</h2>
              <p>FlowSync will generate a structured checklist of tasks mapped across 6 production phases.</p>
            </div>
            <form className="workflow-create" onSubmit={handleSubmit}>
              <div className="form-group full-width">
                <label htmlFor="proj-name">
                  Project Name
                  <input 
                    id="proj-name"
                    value={name} 
                    onChange={(event) => setName(event.target.value)} 
                    placeholder="e.g., Launch My Business Website" 
                    className="ob-input has-value"
                  />
                </label>
              </div>
              <div className="form-group full-width">
                <label htmlFor="proj-goal">
                  What is your project goal? <span className="ob-required">*</span>
                  <textarea 
                    id="proj-goal"
                    ref={goalInputRef}
                    value={goal} 
                    onChange={(event) => setGoal(event.target.value)} 
                    placeholder="e.g., Launch a website for my small business in 30 days." 
                    required 
                    rows="4" 
                    className="ob-input has-value"
                  />
                </label>
              </div>
              <div className="form-group full-width">
                <label htmlFor="proj-date">
                  Target Launch Date <span>(optional)</span>
                  <input 
                    id="proj-date"
                    type="date"
                    value={targetDate} 
                    onChange={(event) => setTargetDate(event.target.value)} 
                    className="ob-input has-value"
                  />
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="workflow-secondary ripple" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button className="workflow-primary ripple" type="submit">
                  Generate Workflow
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    );
  }

  const progress = getProjectProgress(project.tasks);
  const completed = project.tasks.filter((item) => item.status === 'done').length;

  // Group tasks by their phase
  const tasksByPhase = PHASES.reduce((acc, phase) => {
    acc[phase] = project.tasks.filter((task) => task.phase === phase);
    return acc;
  }, {});

  return (
    <section className="workflow-workspace" aria-labelledby="project-title">
      <header className="workflow-header">
        <div className="workflow-header-info">
          <span className="workflow-kicker">Active Project Workflow</span>
          <h1 id="project-title">{project.name}</h1>
          <p className="project-description">{project.goal}</p>
          {project.targetDate && (
            <span className="project-deadline-tag">
              Target Date: {new Date(project.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
        <div className="workflow-header-actions">
          <button type="button" className="workflow-secondary ripple" onClick={() => setShowCreateForm(true)}>
            + New Project
          </button>
          <button 
            type="button" 
            className="workflow-danger-btn ripple" 
            onClick={() => {
              if (confirm('Are you sure you want to delete this project?')) {
                deleteProject(project.id);
              }
            }}
            title="Delete active project"
          >
            Delete Project
          </button>
        </div>
      </header>

      <div className="workflow-progress" aria-label={`${progress}% complete`}>
        <div className="workflow-progress__summary">
          <strong>{progress}% complete</strong>
          <span>{completed} of {project.tasks.length} tasks completed</span>
        </div>
        <div className="workflow-progress__track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="workflow-phases-container">
        {PHASES.map((phase) => {
          const phaseTasks = tasksByPhase[phase] || [];
          if (phaseTasks.length === 0) return null;

          const phaseCompleted = phaseTasks.filter((t) => t.status === 'done').length;
          const phasePercent = Math.round((phaseCompleted / phaseTasks.length) * 100);
          const isExpanded = expandedPhases[phase] !== false;

          return (
            <div key={phase} className="workflow-phase-section">
              <header 
                className="workflow-phase-header" 
                onClick={() => togglePhase(phase)}
                style={{ cursor: 'pointer' }}
              >
                <div className="workflow-phase-header-left">
                  <span className={`phase-chevron ${isExpanded ? 'is-expanded' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                  <h3>{phase}</h3>
                  <span className="phase-badge">{phaseTasks.length} tasks</span>
                </div>
                <div className="workflow-phase-header-right">
                  <span className="phase-progress-text">{phaseCompleted}/{phaseTasks.length} Completed</span>
                  <div className="phase-mini-track">
                    <span style={{ width: `${phasePercent}%` }} />
                  </div>
                </div>
              </header>

              {isExpanded && (
                <div className="workflow-task-list">
                  {phaseTasks.map((item) => (
                    <article className={`workflow-task workflow-task--${item.status}`} key={item.id}>
                      <div className="workflow-task__topline">
                        <div className="task-status-selector">
                          <select 
                            value={item.status} 
                            onChange={(event) => updateTask(item.id, { status: event.target.value })} 
                            aria-label={`Status for ${item.title}`}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <span className={`workflow-priority workflow-priority--${item.priority}`}>
                          {item.priority}
                        </span>
                        <span className="workflow-timeline">{item.timeline}</span>
                      </div>
                      
                      <input 
                        className="workflow-task__title" 
                        value={item.title} 
                        onChange={(event) => updateTask(item.id, { title: event.target.value })} 
                        aria-label="Task title" 
                      />
                      
                      <textarea 
                        className="workflow-task__description" 
                        value={item.description} 
                        onChange={(event) => updateTask(item.id, { description: event.target.value })} 
                        rows="2" 
                        aria-label={`Description for ${item.title}`} 
                      />
                      
                      <div className="workflow-task__details">
                        <label>
                          Priority
                          <select 
                            value={item.priority} 
                            onChange={(event) => updateTask(item.id, { priority: event.target.value })}
                          >
                            {PRIORITY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Timeline / Day
                          <input 
                            value={item.timeline} 
                            onChange={(event) => updateTask(item.id, { timeline: event.target.value })} 
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

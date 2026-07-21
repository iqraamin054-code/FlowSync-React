import { useState, useEffect, useRef } from 'react';
import { getAvailableDays, getProjectProgress } from '../../utils/workflowGenerator.js';
import { TRANSLATIONS } from '../../data/translations.js';

const PHASES = ['Planning', 'Design', 'Development', 'Content', 'Testing', 'Launch'];

export default function WorkflowWorkspace({ createRequest = 0, onCreateRequestHandled, lang = 'en', industry = '', project, startProject, updateTask, deleteProject, onCancel, onBack }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dateError, setDateError] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const [expandedPhases, setExpandedPhases] = useState({
    Planning: true,
    Design: true,
    Development: true,
    Content: true,
    Testing: true,
    Launch: true,
  });

  const goalInputRef = useRef(null);

  // Translation helper — scoped inside the component so it picks up the lang prop reactively
  const t = (key, interpolations = {}) => {
    let text = (TRANSLATIONS[lang] || TRANSLATIONS.en)[key] || key;
    Object.entries(interpolations).forEach(([k, v]) => {
      text = text.split('{' + k + '}').join(String(v));
    });
    return text;
  };

  // Focus the goal textarea when the creation form is displayed
  useEffect(() => {
    if (showCreateForm && goalInputRef.current) {
      goalInputRef.current.focus();
    }
  }, [showCreateForm]);

  useEffect(() => {
    if (createRequest > 0) {
      setShowCreateForm(true);
      onCreateRequestHandled?.();
    }
  }, [createRequest, onCreateRequestHandled]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!goal.trim()) return;
    const daysAvailable = getAvailableDays(targetDate);
    if (daysAvailable !== null && daysAvailable < 0) {
      setDateError(t('dateError'));
      return;
    }
    startProject({ name, goal, targetDate, industry });
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

  const STATUS_OPTIONS = [
    { value: 'todo', label: t('todo') },
    { value: 'in-progress', label: t('inProgressWS') },
    { value: 'done', label: t('completeWS') },
  ];

  const PRIORITY_OPTIONS = [
    { value: 'high', label: t('high') },
    { value: 'medium', label: t('medium') },
    { value: 'low', label: t('low') },
  ];

  // Translated phase display names
  const PHASE_DISPLAY = {
    Planning: t('phasePlanning'),
    Design: t('phaseDesign'),
    Development: t('phaseDev'),
    Content: t('phaseContent'),
    Testing: t('phaseTesting'),
    Launch: t('phaseLaunch'),
  };

  // If there is no active project OR the user clicked "+ New Project"
  if (!project || showCreateForm) {
    return (
      <section className={`workflow-empty${showCreateForm ? ' workflow-empty--create' : ''}`} aria-labelledby="workflow-title">
        {!project && !showCreateForm ? (
          <div className="workflow-empty__intro">
            <span className="workflow-kicker">{t('yourWorkspaceKicker')}</span>
            <h1 id="workflow-title">{t('readyToTurn')}</h1>
            <p className="workflow-empty-desc">
              {t('readyDesc')}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
              <button 
                type="button" 
                className="workflow-primary ripple" 
                style={{ padding: '0.8rem 2.2rem', fontSize: '1.05rem', fontWeight: 'bold' }} 
                onClick={() => setShowCreateForm(true)}
              >
                {t('createProjectCTA')}
              </button>
            </div>

            <div className="workflow-loop" aria-label={t('workflowLoopLabel')}>
              <div className="workflow-loop__item">
                <span className="workflow-loop__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </span>
                <span className="workflow-loop__label">{t('loopGoal')}</span>
              </div>
              <span className="workflow-loop__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
              <div className="workflow-loop__item">
                <span className="workflow-loop__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                <span className="workflow-loop__label">{t('loopWorkflow')}</span>
              </div>
              <span className="workflow-loop__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
              <div className="workflow-loop__item">
                <span className="workflow-loop__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </span>
                <span className="workflow-loop__label">{t('loopTasks')}</span>
              </div>
              <span className="workflow-loop__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
              <div className="workflow-loop__item">
                <span className="workflow-loop__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </span>
                <span className="workflow-loop__label">{t('loopProgress')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="workflow-create-container">
            <div className="workflow-empty__copy">
              <span className="workflow-kicker">{t('newProjectKicker')}</span>
              <h2>{t('newProjectTitle')}</h2>
              <p>{t('newProjectDesc')}</p>
            </div>
            <form className="workflow-create" onSubmit={handleSubmit}>
              <div className="form-group full-width">
                <label htmlFor="proj-name">
                  {t('projectNameLabel')}
                  <input 
                    id="proj-name"
                    value={name} 
                    onChange={(event) => setName(event.target.value)} 
                    placeholder="e.g., My Business Website" 
                    className="ob-input has-value"
                  />
                </label>
              </div>
              <div className="form-group full-width">
                <label htmlFor="proj-goal">
                  {t('projectGoalLabel')} <span className="ob-required">*</span>
                  <textarea 
                    id="proj-goal"
                    ref={goalInputRef}
                    value={goal} 
                    onChange={(event) => setGoal(event.target.value)} 
                    placeholder="e.g., Build a website for my business in 30 days." 
                    required 
                    rows="4" 
                    className="ob-input has-value"
                  />
                </label>
              </div>
              <div className="form-group full-width">
                <label htmlFor="proj-date">
                  {t('targetDateLabel')} <span>{t('optionalTag')}</span>
                  <input 
                    id="proj-date"
                    type="date"
                    value={targetDate} 
                    onChange={(event) => { setTargetDate(event.target.value); setDateError(''); }}
                    className="ob-input has-value"
                  />
                </label>
                {targetDate && getAvailableDays(targetDate) !== null && getAvailableDays(targetDate) >= 0 && (
                  <p className="workflow-date-hint">
                    {getAvailableDays(targetDate) === 0
                      ? t('dueTodayHint')
                      : t('daysAvailableHint', { days: `${getAvailableDays(targetDate)} day${getAvailableDays(targetDate) === 1 ? '' : 's'}` })}
                  </p>
                )}
                {dateError && <p className="workflow-date-error" role="alert">{dateError}</p>}
              </div>
              <div className="form-actions">
                <button type="button" className="workflow-secondary ripple" onClick={() => { setShowCreateForm(false); onCancel?.(); }}>
                  {t('cancelBtnWS')}
                </button>
                <button className="workflow-primary ripple" type="submit">
                  {t('generateWorkflowBtn')}
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
      {onBack && (
        <button 
          type="button" 
          className="workflow-back-btn ripple" 
          onClick={onBack}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>{t('backToDashboard')}</span>
        </button>
      )}

      <header className="workflow-header">
        <div className="workflow-header-info">
          <span className="workflow-kicker">{t('workspaceKicker')}</span>
          <h1 id="project-title">{project.name}</h1>
          <p className="project-description">{project.goal}</p>
          {project.targetDate && (() => {
            const d = new Date(project.targetDate);
            return (
              <span className="project-deadline-tag">
                {t('targetDateLabel')}: {String(d.getDate()).padStart(2, '0')} / {String(d.getMonth() + 1).padStart(2, '0')} / {d.getFullYear()}
              </span>
            );
          })()}
        </div>
        <div className="workflow-header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="button" className="workflow-primary ripple" onClick={() => setShowCreateForm(true)}>
            {t('createNewProjectBtn')}
          </button>
          <button 
            type="button" 
            className="workflow-danger-btn ripple" 
            onClick={() => setProjectToDelete(project)}
            title={t('deleteProjectBtn')}
          >
            {t('deleteProjectBtn')}
          </button>
        </div>
      </header>

      <div className="workflow-progress" aria-label={`${progress}% ${t('completeKicker')}`}>
        <div className="workflow-progress__summary">
          <strong>{progress}% {t('completeKicker')}</strong>
          <span>{t('tasksCompletedKicker', { completed, total: project.tasks.length })}</span>
        </div>
        <div className="workflow-progress__track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="workflow-phases-container">
        {PHASES.map((phase) => {
          const phaseTasks = tasksByPhase[phase] || [];
          if (phaseTasks.length === 0) return null;

          const phaseCompleted = phaseTasks.filter((task) => task.status === 'done').length;
          const phasePercent = Math.round((phaseCompleted / phaseTasks.length) * 100);
          const isExpanded = expandedPhases[phase] !== false;
          const displayName = PHASE_DISPLAY[phase] || phase;

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
                  <h3>{displayName}</h3>
                  <span className="phase-badge">{phaseTasks.length} {t('tasksLabel')}</span>
                </div>
                <div className="workflow-phase-header-right">
                  <span className="phase-progress-text">{phaseCompleted}/{phaseTasks.length} {t('completedLabel')}</span>
                  <div className="phase-mini-track">
                    <span style={{ width: `${phasePercent}%` }} />
                  </div>
                </div>
              </header>

              {isExpanded && (
                <div className="workflow-task-list">
                  {phaseTasks.map((item) => {
                    const isDone = item.status === 'done';
                    return (
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
                        
                        {/* Circular Checkbox Row to quick-tick complete/incomplete */}
                        <div className="workflow-task__main-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.8rem' }}>
                          <button
                            type="button"
                            className={`task-tick-btn ${isDone ? 'is-done' : ''}`}
                            onClick={() => updateTask(item.id, { status: isDone ? 'todo' : 'done' })}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: isDone ? '2px solid #10B981' : '2px solid var(--tick-border, rgba(255,255,255,0.2))',
                              background: isDone ? '#10B981' : 'transparent',
                              color: 'white',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                              padding: 0
                            }}
                            title={isDone ? t('markIncomplete') : t('markComplete')}
                          >
                            {isDone && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </button>

                          <input 
                            className="workflow-task__title" 
                            value={item.title} 
                            onChange={(event) => updateTask(item.id, { title: event.target.value })} 
                            aria-label="Task title"
                            style={{
                              marginTop: 0,
                              textDecoration: isDone ? 'line-through' : 'none',
                              opacity: isDone ? 0.6 : 1,
                              flexGrow: 1
                            }}
                          />
                        </div>
                        
                        <textarea 
                          className="workflow-task__description" 
                          value={item.description} 
                          onChange={(event) => updateTask(item.id, { description: event.target.value })} 
                          rows="2" 
                          aria-label={`Description for ${item.title}`} 
                          style={{
                            opacity: isDone ? 0.6 : 1
                          }}
                        />
                        
                        <div className="workflow-task__details">
                          <label>
                            {t('priorityLabel')}
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
                            {t('timelineLabel')}
                            <input 
                              value={item.timeline} 
                              onChange={(event) => updateTask(item.id, { timeline: event.target.value })} 
                            />
                          </label>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="pd-overlay is-open" onClick={() => setProjectToDelete(null)} style={{ zIndex: 9999 }}>
          <div className="pd-modal" role="dialog" onClick={e => e.stopPropagation()}>
            <div className="pd-modal-header">
              <span className="pd-modal-title">{t('deleteProjectTitle')}</span>
              <button className="pd-modal-close" onClick={() => setProjectToDelete(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="pd-confirm" style={{ padding: '1rem 0' }}>
              <div className="pd-confirm-icon" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </div>
              <div className="pd-confirm-title" style={{ color: 'var(--text-primary)' }}>{t('areYouSure')}</div>
              <p className="pd-confirm-msg" style={{ color: 'var(--text-secondary)' }}>
                {t('deleteConfirmMsg', { name: projectToDelete.name })}
              </p>
              <div className="pd-confirm-actions">
                <button className="pd-confirm-cancel" onClick={() => setProjectToDelete(null)}>{t('cancelBtn')}</button>
                <button 
                  className="pd-confirm-logout" 
                  style={{ backgroundColor: '#EF4444', borderColor: '#EF4444', color: 'white' }} 
                  onClick={() => {
                    deleteProject(projectToDelete.id);
                    setProjectToDelete(null);
                  }}
                >
                  {t('deleteProjectBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

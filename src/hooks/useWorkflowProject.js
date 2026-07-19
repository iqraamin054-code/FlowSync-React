import { useCallback, useState } from 'react';
import { createProject } from '../utils/workflowGenerator.js';
import { getActiveEmail, getWorkspace, saveWorkspace } from '../utils/workspaceStorage.js';

export default function useWorkflowProject() {
  const [workspace, setWorkspace] = useState(() => getWorkspace());
  const userEmail = getActiveEmail();
  const activeProject = workspace.projects.find((p) => p.id === workspace.activeProjectId) || null;

  const startProject = useCallback((values) => {
    const newProj = createProject(values);
    setWorkspace((current) => {
      const next = { ...current, projects: [newProj, ...current.projects], activeProjectId: newProj.id };
      saveWorkspace(userEmail, next);
      return next;
    });
    return newProj;
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setWorkspace((current) => {
      const nextProjects = current.projects.map((p) => {
        if (p.id !== current.activeProjectId) return p;
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          tasks: p.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      });
      const next = { ...current, projects: nextProjects };
      saveWorkspace(userEmail, next);
      return next;
    });
  }, []);

  const selectProject = useCallback((projectId) => {
    setWorkspace((current) => {
      const next = { ...current, activeProjectId: projectId };
      saveWorkspace(userEmail, next);
      return next;
    });
  }, []);

  const deleteProject = useCallback((projectId) => {
    setWorkspace((current) => {
      const nextProjects = current.projects.filter((p) => p.id !== projectId);
      let nextActiveId = current.activeProjectId;
      if (projectId === current.activeProjectId) {
        nextActiveId = nextProjects.length > 0 ? nextProjects[0].id : null;
      }
      const next = { ...current, projects: nextProjects, activeProjectId: nextActiveId };
      saveWorkspace(userEmail, next);
      return next;
    });
  }, []);

  const resetProject = useCallback(() => {
    if (workspace.activeProjectId) {
      deleteProject(workspace.activeProjectId);
    }
  }, [workspace.activeProjectId, deleteProject]);

  return {
    project: activeProject,
    projects: workspace.projects,
    startProject,
    updateTask,
    selectProject,
    deleteProject,
    resetProject,
  };
}

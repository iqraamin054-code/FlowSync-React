import { useCallback, useState, useEffect } from 'react';
import { createProject } from '../utils/workflowGenerator.js';

const PROJECTS_KEY = 'flowsync-projects-list';
const CURRENT_ID_KEY = 'flowsync-current-project-id';
const LEGACY_KEY = 'flowsync-workflow-project';

function getStoredData() {
  try {
    let projects = [];
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    
    if (storedProjects) {
      projects = JSON.parse(storedProjects);
    } else {
      // Fallback/migration from legacy single-project storage key
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed) {
          projects = [parsed];
          localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        }
      }
    }

    let activeId = localStorage.getItem(CURRENT_ID_KEY);
    if (!activeId && projects.length > 0) {
      activeId = projects[0].id;
      localStorage.setItem(CURRENT_ID_KEY, activeId);
    }

    return { projects, activeId };
  } catch (e) {
    console.error('Failed to read workflow projects from storage', e);
    return { projects: [], activeId: null };
  }
}

export default function useWorkflowProject() {
  const [data, setData] = useState(getStoredData);

  // Sync state changes back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(data.projects));
      if (data.activeId) {
        localStorage.setItem(CURRENT_ID_KEY, data.activeId);
      } else {
        localStorage.removeItem(CURRENT_ID_KEY);
      }
    } catch (e) {
      console.error('Failed to sync workflow projects to storage', e);
    }
  }, [data]);

  const activeProject = data.projects.find((p) => p.id === data.activeId) || null;

  const startProject = useCallback((values) => {
    const newProj = createProject(values);
    setData((current) => {
      const nextProjects = [newProj, ...current.projects];
      return {
        projects: nextProjects,
        activeId: newProj.id,
      };
    });
    return newProj;
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setData((current) => {
      const nextProjects = current.projects.map((p) => {
        if (p.id !== current.activeId) return p;
        return {
          ...p,
          tasks: p.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      });
      return {
        ...current,
        projects: nextProjects,
      };
    });
  }, []);

  const selectProject = useCallback((projectId) => {
    setData((current) => ({
      ...current,
      activeId: projectId,
    }));
  }, []);

  const deleteProject = useCallback((projectId) => {
    setData((current) => {
      const nextProjects = current.projects.filter((p) => p.id !== projectId);
      let nextActiveId = current.activeId;
      if (projectId === current.activeId) {
        nextActiveId = nextProjects.length > 0 ? nextProjects[0].id : null;
      }
      return {
        projects: nextProjects,
        activeId: nextActiveId,
      };
    });
  }, []);

  const resetProject = useCallback(() => {
    if (data.activeId) {
      deleteProject(data.activeId);
    }
  }, [data.activeId, deleteProject]);

  return {
    project: activeProject,
    projects: data.projects,
    startProject,
    updateTask,
    selectProject,
    deleteProject,
    resetProject,
  };
}

import { useState, useEffect } from 'react';
import { getTasksByProject, createTask, updateTaskStatus } from '../api/taskApi';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!projectId) return;
    setLoading(true);
    try { const { data } = await getTasksByProject(projectId); setTasks(data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addTask = async (form) => {
    const { data } = await createTask(projectId, form);
    setTasks(prev => [...prev, data]);
    return data;
  };

  const changeStatus = async (taskId, status) => {
    await updateTaskStatus(projectId, taskId, status);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  useEffect(() => { fetchTasks(); }, [projectId]);

  return { tasks, loading, addTask, changeStatus, refreshTasks: fetchTasks };
};
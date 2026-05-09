import { useState, useEffect } from 'react';
import { getAllProjects, createProject } from '../api/projectApi';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try { const { data } = await getAllProjects(); setProjects(data); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addProject = async (form) => {
    const { data } = await createProject(form);
    setProjects(prev => [data, ...prev]);
    return data;
  };

  useEffect(() => { fetchProjects(); }, []);

  return { projects, loading, addProject, refreshProjects: fetchProjects };
};
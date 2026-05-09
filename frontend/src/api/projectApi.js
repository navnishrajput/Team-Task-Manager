import api from './axiosConfig';

export const createProject = (data) => api.post('/projects', data);
export const getAllProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const addMember = (projectId, data) => api.post(`/projects/${projectId}/members`, data);
export const removeMember = (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`);
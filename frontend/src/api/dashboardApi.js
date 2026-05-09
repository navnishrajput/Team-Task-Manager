import api from './axiosConfig';

export const getProjectDashboard = (projectId) => api.get(`/dashboard/project/${projectId}`);
export const getMyDashboard = () => api.get('/dashboard/me');
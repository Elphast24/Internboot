import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const jobsAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  postJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/employer/my-jobs'),
};

export const applicationsAPI = {
  applyJob: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateApplicationStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

export default api;
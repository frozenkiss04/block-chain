import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vineyard API
export const vineyardAPI = {
  getAll: () => api.get('/vineyards'),
  getById: (id) => api.get(`/vineyards/${id}`),
  create: (data) => api.post('/vineyards', data),
  update: (id, data) => api.put(`/vineyards/${id}`, data),
  delete: (id) => api.delete(`/vineyards/${id}`),
};

// Process API
export const processAPI = {
  getAll: () => api.get('/processes'),
  getById: (id) => api.get(`/processes/${id}`),
  getByVineyard: (vineyardId) => api.get(`/processes/vineyard/${vineyardId}`),
  upload: (formData) => {
    return axios.post(`${API_URL}/processes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/processes/${id}`),
};

// Traceability API
export const traceabilityAPI = {
  getAll: () => api.get('/traceability'),
  getByVineyard: (id) => api.get(`/traceability/${id}`),
};

export default api;

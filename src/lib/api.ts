const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Generic fetch wrapper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Contact API
export const contactAPI = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
  }) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => apiRequest('/contact'),
  getOne: (id: string) => apiRequest(`/contact/${id}`),
  updateStatus: (id: string, status: string) =>
    apiRequest(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => apiRequest(`/contact/${id}`, { method: 'DELETE' }),
};

// Service API
export const serviceAPI = {
  getAll: () => apiRequest('/services'),
  getOne: (id: string) => apiRequest(`/services/${id}`),
  create: (data: any) =>
    apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiRequest(`/services/${id}`, { method: 'DELETE' }),
};

// Project API
export const projectAPI = {
  getAll: (category?: string) =>
    apiRequest(category ? `/projects?category=${category}` : '/projects'),
  getOne: (id: string) => apiRequest(`/projects/${id}`),
  create: (data: any) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
};

// About API
export const aboutAPI = {
  get: () => apiRequest('/about'),
  update: (data: any) =>
    apiRequest('/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getCurrentAdmin: () => apiRequest('/auth/me'),
};

// Career API
export const careerAPI = {
  submit: (formData: FormData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}/careers`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    });
  },
  getAll: () => apiRequest('/careers'),
  getOne: (id: string) => apiRequest(`/careers/${id}`),
  getResumeUrl: (id: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${API_URL}/careers/${id}/resume`;
  },
  updateStatus: (id: string, status: string) =>
    apiRequest(`/careers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => apiRequest(`/careers/${id}`, { method: 'DELETE' }),
};


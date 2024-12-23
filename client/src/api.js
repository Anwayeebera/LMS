import axios from 'axios';

// Create API instance with base configuration
const API = axios.create({ 
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const createCourse = (courseData) => API.post('/courses/create', courseData);

export const enrollCourse = (courseId) => {
    console.log('Enrolling in course:', courseId);
    return API.post(`/courses/enroll/${courseId}`, {});  // Add empty object as body
};

export const fetchCourses = (filters) => API.get('/courses', { params: filters });
export const updateCourse = (id, courseData) => API.put(`/courses/update/${id}`, courseData);

export const getCourseById = async (courseId) => {
    try {
        const response = await API.get(`/courses/search/${courseId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

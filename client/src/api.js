import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Token injection for authenticated requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const createCourse = (courseData) => API.post('/courses', courseData);
export const enrollCourse = (courseId) => API.post(`/courses/enroll/${courseId}`);
export const fetchCourses = (filters) => API.get('/courses', { params: filters });
export const updateCourse = (id, courseData) => API.put(`/courses/${id}`, courseData);

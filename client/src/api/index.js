import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// Add auth token to requests if available
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const createCourse = async (courseData) => {
    try {
        const response = await API.post('/courses', courseData);
        return response;
    } catch (error) {
        if (error.response?.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Please login to create a course');
        }
        throw error.response?.data || error.message;
    }
}; 
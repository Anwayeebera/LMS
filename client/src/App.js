import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import CreateCourse from './components/courses/CreateCourse';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/common.css';
import AboutPage from './components/AboutPage';
import CourseManagement from './components/courses/CourseManagement';

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course" 
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manage-courses" 
              element={
                <ProtectedRoute>
                  <CourseManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;

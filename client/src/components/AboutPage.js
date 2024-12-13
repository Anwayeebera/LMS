import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Unlock the Future of Learning</h1>
                    <h2>with Our Comprehensive LMS Solution</h2>
                    <p>Our Learning Management System empowers teachers to effortlessly create and share courses. Students can easily enroll and access materials anytime, anywhere.</p>
                    <div className="user-types">
                        <div className="user-type">
                            <h3>For Teachers</h3>
                            <p>Streamline course creation and enhance student engagement with interactive content.</p>
                        </div>
                        <div className="user-type">
                            <h3>For Students</h3>
                            <p>Access a wide range of courses at your convenience and learn at your pace.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <span className="badge">Empower</span>
                    <h2>Unlock Your Teaching Potential with Our Features</h2>
                    <p>Our platform simplifies course creation, allowing educators to easily upload materials and share them with students. Experience seamless student enrollment and effective progress tracking to enhance learning outcomes.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Effortless Course Creation for Educators</h3>
                        <p>Create engaging courses with just a few clicks.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Streamlined Student Enrollment Process</h3>
                        <p>Students can easily register and enroll in courses.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Comprehensive Progress Tracking for Students</h3>
                        <p>Monitor student progress to ensure effective learning.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <span className="badge">Learn</span>
                    <h2>Creating and Enrolling in Courses Made Easy</h2>
                    <p>Our platform simplifies course creation for teachers and makes learning accessible for students. With just a few clicks, you can share knowledge and foster a love for learning.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-icon">🎓</div>
                        <h3>For Teachers: Create Your Course Effortlessly</h3>
                        <p>Upload your materials, set up your course, and share the link.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">📱</div>
                        <h3>For Students: Enroll and Start Learning</h3>
                        <p>Simply register or log in to access courses.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">👥</div>
                        <h3>Join Our Community of Lifelong Learners</h3>
                        <p>Connect with educators and peers to enhance your learning experience.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Customer Testimonials</h2>
                    <p>This platform transformed how I teach my courses.</p>
                </div>

                <div className="testimonials-carousel">
                    <div className="testimonial-card">
                        <div className="rating">⭐⭐⭐⭐⭐</div>
                        <p className="quote">"The LMS has made course creation so easy and efficient!"</p>
                        <div className="author">
                            <div className="author-info">
                                <h4>Emily Johnson</h4>
                                <p>Teacher, Local School</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="rating">⭐⭐⭐⭐⭐</div>
                        <p className="quote">"I love how my students can learn at their own pace!"</p>
                        <div className="author">
                            <div className="author-info">
                                <h4>Michael Smith</h4>
                                <p>Instructor, Online Academy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Join our community of educators and learners today.</p>
                <div className="cta-buttons">
                    <button className="btn btn-primary">Sign Up Now</button>
                    <button className="btn btn-secondary">Learn More</button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage; 
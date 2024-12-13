import React, { useState, useEffect } from 'react';
import { createCourse } from '../../api';
import './CreateCourse.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCourse = () => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        content: []
    });

    const [isAddingContent, setIsAddingContent] = useState(false);
    const [contentType, setContentType] = useState(null);
    const [currentContent, setCurrentContent] = useState('');
    const [currentFile, setCurrentFile] = useState(null);
    const [editingContent, setEditingContent] = useState(null);

    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const isValidYouTubeUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11;
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleAddContent = () => {
        if (!currentContent && !currentFile) return;

        let contentData;
        if (contentType === 'video') {
            const videoId = extractYouTubeId(currentContent);
            contentData = {
                url: currentContent,
                videoId: videoId,
                embedUrl: `https://www.youtube.com/embed/${videoId}`
            };
        } else {
            contentData = contentType === 'text' ? currentContent : currentFile;
        }

        setCourseData(prev => ({
            ...prev,
            content: [...prev.content, {
                type: contentType,
                data: contentData
            }]
        }));
        
        setCurrentContent('');
        setCurrentFile(null);
        setContentType(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!courseData.title || !courseData.description) {
            alert('Please fill in both title and description before creating the course.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to create a course');
                navigate('/login');
                return;
            }

            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);

            // Format the content properly
            const formattedContent = courseData.content.map(item => {
                if (item.type === 'text') {
                    return {
                        type: 'text',
                        data: item.data
                    };
                } else if (item.type === 'video') {
                    return {
                        type: 'video',
                        data: {
                            url: item.data.url,
                            videoId: extractYouTubeId(item.data.url)
                        }
                    };
                } else if (item.type === 'document') {
                    return {
                        type: 'document',
                        data: {
                            name: item.data.name,
                            url: item.data.url || '',
                            type: item.data.type
                        }
                    };
                }
                return item;
            });

            // Create the payload
            const coursePayload = {
                title: courseData.title,
                description: courseData.description,
                content: formattedContent
            };

            // Add token validation check
            console.log('Token before request:', token);
            
            console.log('Making request to:', `${API_URL}/courses`);
            
            const response = await axios({
                method: 'POST',
                url: `${API_URL}/courses`,
                data: coursePayload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                alert('Course created successfully!');
                navigate('/manage-courses');
            }
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.response?.data?.message,
                error: error.message,
                config: {
                    ...error.config,
                    headers: error.config?.headers
                },
                responseData: error.response?.data
            });
            
            if (!error.response) {
                alert('Network error. Please check your connection.');
            } else if (error.response.status === 401) {
                console.log('Unauthorized: Token might be invalid or expired');
                alert('Your session has expired. Please login again.');
                navigate('/login');
            } else if (error.response.status === 403) {
                console.log('Forbidden:', error.response?.data?.message || 'User might not have permission');
                alert(`Permission denied: ${error.response?.data?.message || 'You do not have permission to create courses.'}`);
            } else if (error.response.status === 404) {
                alert('API endpoint not found. Please check server configuration.');
            } else {
                alert(error.response?.data?.message || 'Failed to create course. Please try again.');
            }
        }
    };

    const handleDeleteContent = (index) => {
        setCourseData(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const handleEditContent = (index) => {
        const contentToEdit = courseData.content[index];
        setContentType(contentToEdit.type);
        setCurrentContent(contentToEdit.type === 'text' ? contentToEdit.data : 
                        contentToEdit.type === 'video' ? contentToEdit.data.url : '');
        setCurrentFile(contentToEdit.type !== 'text' && contentToEdit.type !== 'video' ? contentToEdit.data : null);
        setEditingContent(index);
    };

    const handleUpdateContent = () => {
        if (!currentContent && !currentFile) return;

        let contentData;
        if (contentType === 'video') {
            const videoId = extractYouTubeId(currentContent);
            contentData = {
                url: currentContent,
                videoId: videoId,
                embedUrl: `https://www.youtube.com/embed/${videoId}`
            };
        } else {
            contentData = contentType === 'text' ? currentContent : currentFile;
        }

        setCourseData(prev => ({
            ...prev,
            content: prev.content.map((item, index) => 
                index === editingContent ? {
                    type: contentType,
                    data: contentData
                } : item
            )
        }));
        
        setCurrentContent('');
        setCurrentFile(null);
        setContentType(null);
        setEditingContent(null);
    };

    const renderContentInput = () => {
        switch(contentType) {
            case 'text':
                return (
                    <div className="content-input-container">
                        <textarea
                            value={currentContent}
                            onChange={(e) => setCurrentContent(e.target.value)}
                            placeholder="Enter your text content"
                            className="course-input"
                        />
                        <div className="content-actions">
                            <button 
                                onClick={() => {
                                    setContentType(null);
                                    setEditingContent(null);
                                    setCurrentContent('');
                                    setCurrentFile(null);
                                }} 
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={editingContent !== null ? handleUpdateContent : handleAddContent} 
                                className="add-btn"
                                disabled={contentType === 'video' && !isValidYouTubeUrl(currentContent)}
                            >
                                {editingContent !== null ? 'Update' : 'Add'} {contentType}
                            </button>
                        </div>
                    </div>
                );
            case 'document':
                return (
                    <div className="content-input-container">
                        <input
                            type="file"
                            onChange={(e) => setCurrentFile(e.target.files[0])}
                            className="file-input"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.zip,.rar"
                        />
                        <div className="file-types-hint">
                            Supported files: Images, PDF, Word, PowerPoint, Excel, Text files, etc.
                        </div>
                        <div className="content-actions">
                            <button 
                                onClick={() => {
                                    setContentType(null);
                                    setEditingContent(null);
                                    setCurrentContent('');
                                    setCurrentFile(null);
                                }} 
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={editingContent !== null ? handleUpdateContent : handleAddContent} 
                                className="add-btn"
                                disabled={contentType === 'video' && !isValidYouTubeUrl(currentContent)}
                            >
                                {editingContent !== null ? 'Update' : 'Add'} {contentType}
                            </button>
                        </div>
                    </div>
                );
            case 'video':
                return (
                    <div className="content-input-container">
                        <div className="video-input-options">
                            <h3>Add Video Content</h3>
                            <div className="video-options">
                                <input
                                    type="text"
                                    placeholder="Enter YouTube Video URL"
                                    className="course-input"
                                    value={currentContent}
                                    onChange={(e) => setCurrentContent(e.target.value)}
                                />
                                <div className="video-instructions">
                                    <p>How to add a video:</p>
                                    <ol>
                                        <li>Upload your video to YouTube as "Unlisted"</li>
                                        <li>Copy the video URL</li>
                                        <li>Paste it here</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div className="content-actions">
                            <button 
                                onClick={() => {
                                    setContentType(null);
                                    setEditingContent(null);
                                    setCurrentContent('');
                                    setCurrentFile(null);
                                }} 
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={editingContent !== null ? handleUpdateContent : handleAddContent} 
                                className="add-btn"
                                disabled={contentType === 'video' && !isValidYouTubeUrl(currentContent)}
                            >
                                {editingContent !== null ? 'Update' : 'Add'} {contentType}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to create a course');
            navigate('/login');
        }
    }, []);

    return (
        <div className="create-course">
            <div className="create-course-container">
                <div className="course-section">
                    <label>Set Course Title</label>
                    <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                        placeholder="Enter course title"
                        className="course-input"
                    />
                </div>

                <div className="course-section">
                    <label>Write Description</label>
                    <textarea
                        value={courseData.description}
                        onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                        placeholder="Enter course description"
                        className="course-input"
                    />
                </div>

                <div className="content-section">
                    {courseData.content.map((item, index) => (
                        <div key={index} className={`content-item ${item.type}`}>
                            <div className="content-item-header">
                                <span>{item.type}</span>
                                <div className="content-item-actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEditContent(index)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteContent(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {item.type === 'text' ? (
                                <p>{item.data}</p>
                            ) : item.type === 'video' ? (
                                <div className="video-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${extractYouTubeId(item.data.url)}`}
                                        title="Course Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <p>{item.data.name}</p>
                            )}
                        </div>
                    ))}

                    {!contentType && (
                        <div className="add-content-line-container">
                            <div className="add-content-line">
                                <div className="content-type-buttons">
                                    <button onClick={() => setContentType('text')}>Add Text</button>
                                    <button onClick={() => setContentType('document')}>Add Document</button>
                                    <button onClick={() => setContentType('video')}>Add Video</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {contentType && renderContentInput()}
                </div>

                <div className="submit-container">
                    <button 
                        className="back-btn"
                        onClick={() => navigate('/teacher')}
                    >
                        Back to Dashboard
                    </button>
                    <button 
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={!courseData.title || !courseData.description}
                    >
                        Create Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;

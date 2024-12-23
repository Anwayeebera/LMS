import React, { useState, useEffect } from 'react';
import { createCourse } from '../../api';
import './CreateCourse.css';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        content: []
    });

    const [contentType, setContentType] = useState(null);
    const [currentContent, setCurrentContent] = useState('');
    const [currentFile, setCurrentFile] = useState(null);
    const [editingContent, setEditingContent] = useState(null);
    const [isAddingContent, setIsAddingContent] = useState(false);

    const navigate = useNavigate();

    const isValidYouTubeUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11;
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
                videoId: videoId
            };
        } else if (contentType === 'document') {
            contentData = {
                name: currentFile.name,
                type: currentFile.type,
                url: URL.createObjectURL(currentFile)
            };
        } else {
            contentData = currentContent;
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

            // Format the content properly before sending
            const formattedContent = courseData.content.map(item => {
                switch(item.type) {
                    case 'text':
                        return {
                            type: 'text',
                            data: item.data
                        };
                    case 'video':
                        return {
                            type: 'video',
                            data: {
                                url: item.data.url,
                                videoId: item.data.videoId
                            }
                        };
                    case 'document':
                        return {
                            type: 'document',
                            data: {
                                name: item.data.name,
                                type: item.data.type,
                                url: item.data.url
                            }
                        };
                    default:
                        return item;
                }
            });

            const coursePayload = {
                title: courseData.title.trim(),
                description: courseData.description.trim(),
                content: formattedContent,
                enrollmentStatus: 'draft'
            };

            console.log('Sending course payload:', JSON.stringify(coursePayload, null, 2));

            const response = await createCourse(coursePayload);
            console.log('Course creation response:', response);

            if (response.data.success) {
                alert('Course created successfully!');
                navigate('/manage-courses');
            }
        } catch (error) {
            console.error('Error details:', {
                response: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            
            const errorMessage = error.response?.data?.details || 
                            error.response?.data?.message || 
                            error.response?.data?.error ||
                            'Failed to create course. Please try again.';
            
            alert(errorMessage);
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
                                    setIsAddingContent(false);
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
                                    setIsAddingContent(false);
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
                        <div className="video-input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter YouTube Video URL"
                                className="course-input"
                                value={currentContent}
                                onChange={(e) => setCurrentContent(e.target.value)}
                            />
                            {currentContent && isValidYouTubeUrl(currentContent) && (
                                <div className="video-preview">
                                    <h4>Video Preview</h4>
                                    <div className="video-container">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(currentContent)}`}
                                            title="Video Preview"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="content-actions">
                            <button 
                                onClick={() => {
                                    setContentType(null);
                                    setEditingContent(null);
                                    setCurrentContent('');
                                    setCurrentFile(null);
                                    setIsAddingContent(false);
                                }} 
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={editingContent !== null ? handleUpdateContent : handleAddContent} 
                                className="add-btn"
                                disabled={!isValidYouTubeUrl(currentContent)}
                            >
                                {editingContent !== null ? 'Update' : 'Add'} Video
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
    }, [navigate]);

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

                    <div className="add-content-line-container">
                        <div className="add-content-line">
                            <div className="content-type-buttons">
                                <button 
                                    onClick={() => {
                                        setContentType('text');
                                        setIsAddingContent(true);
                                    }}
                                    className={contentType === 'text' ? 'active' : ''}
                                >
                                    Add Text
                                </button>
                                <button 
                                    onClick={() => {
                                        setContentType('document');
                                        setIsAddingContent(true);
                                    }}
                                    className={contentType === 'document' ? 'active' : ''}
                                >
                                    Add Document
                                </button>
                                <button 
                                    onClick={() => {
                                        setContentType('video');
                                        setIsAddingContent(true);
                                    }}
                                    className={contentType === 'video' ? 'active' : ''}
                                >
                                    Add Video Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {contentType && isAddingContent && (
                        <div className="add-content-options">
                            {renderContentInput()}
                        </div>
                    )}
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

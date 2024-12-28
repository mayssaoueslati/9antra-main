import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
   
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
  
    
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
  
    
    return imagePath;
  };

const CoursesDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
      console.log('Courses response:', response.data); 
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('image', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/courses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchCourses();
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    
    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    try {
      await axios.put(`http://localhost:5000/api/courses/${currentCourse.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchCourses();
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      price: course.price,
    });
    setPreviewUrl(getImageUrl(course.image_path));
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', price: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setCurrentCourse(null);
  };

  return (
    <div className="dashboard-wrapper">
  <div className="dashboard-header-wrapper">
    <h1>Courses Management</h1>
    <button className="new-course-button" onClick={() => setIsAddModalOpen(true)}>
      Add New Course
    </button>
  </div>

  <div className="courses-grid-wrapper">
    {courses.map((course) => (
      <div key={course.id} className="course-card-wrapper">
        <div className="course-thumbnail-container">
          <img 
            src={getImageUrl(course.image_path)} 
            alt={course.title} 
            className="course-thumbnail"
          />
        </div>
        <div className="course-details">
          <h3 className="course-name">{course.title}</h3>
          <p className="course-cost">${course.price}</p>
          <div className="card-controls">
            <button
              className="modify-button"
              onClick={() => openEditModal(course)}
            >
              Edit
            </button>
            <button
              className="remove-button"
              onClick={() => handleDeleteCourse(course.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  
  {isAddModalOpen && (
    <div className="popup-overlay">
      <div className="popup-content-wrapper">
        <h2>Add New Course</h2>
        <form onSubmit={handleAddCourse}>
          <div className="form-field">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-field">
            <label>Course Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file-upload-input"
            />
            {previewUrl && (
              <div className="preview-wrapper">
                <img 
                  src={previewUrl} 
                  alt="Preview"
                  className="image-placeholder"
                />
              </div>
            )}
          </div>
          <div className="popup-buttons">
            <button type="submit" className="confirm-button">
              Add Course
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}


  {isEditModalOpen && (
    <div className="popup-overlay">
      <div className="popup-content-wrapper">
        <h2>Edit Course</h2>
        <form onSubmit={handleEditCourse}>
          <div className="form-field">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-field">
            <label>Course Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-upload-input"
            />
            {previewUrl && (
              <div className="preview-wrapper">
                <img 
                  src={previewUrl} 
                  alt="Preview"
                  className="image-placeholder"
                />
              </div>
            )}
          </div>
          <div className="popup-buttons">
            <button type="submit" className="confirm-button">
              Update Course
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default CoursesDashboard;
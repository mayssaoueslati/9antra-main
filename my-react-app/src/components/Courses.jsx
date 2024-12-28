import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './courses.css';
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
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses'); 
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Discover Our Courses</h1>
        <button className="view-more-btn">View More</button>
      </div>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img src={getImageUrl(course.image_path)} alt={course.title} />
            </div>
            <h2>{course.title}</h2>
            <p className="price">{course.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;

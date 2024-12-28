const express = require('express');

const courseRoutes = require('./routes/courses');

const cors = require('cors');



const app = express();
app.use(express.json()); 
app.use(cors());


app.use('/api/courses', courseRoutes);
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadDir)) {
    require('fs').mkdirSync(uploadDir);
}


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

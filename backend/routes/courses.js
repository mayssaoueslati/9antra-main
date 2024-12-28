const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      'INSERT INTO courses (title, price, image_path) VALUES (?, ?, ?)',
      [title, price, imagePath]
    );
    
    res.status(201).json({ id: result.insertId, title, price, image_path: imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM courses');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let query = 'UPDATE courses SET title = ?, price = ?';
    let params = [title, price];

    if (imagePath) {
      query += ', image_path = ?';
      params.push(imagePath);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);
    res.json({ id, title, price, image_path: imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
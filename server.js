require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { getInterviewQuestions } = require('./services/aiProvider');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const filePath = path.join(__dirname, req.file.path);
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    await fs.unlink(filePath);

    const questions = await getInterviewQuestions(pdfData.text);
    res.json({ preguntas: questions });

  } catch (error) {
    console.error(' Error general:', error.message);
    res.status(500).json({ error: 'Hubo un problema generando las preguntas.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

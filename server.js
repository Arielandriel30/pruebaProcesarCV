require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { getInterviewQuestions } = require('./services/aiProvider');
const { leerPDF } = require('./utils/pdfReader');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Solo se permiten archivos PDF.' });
      }
    
    const filePath = path.join(__dirname, req.file.path);
    const pdfData = await leerPDF(filePath);

    const questions = await getInterviewQuestions(pdfData.text);
    res.json({ preguntas: questions });

  } catch (error) {
    console.error('huggingface falló:', error?.response?.status, error?.response?.data);
    throw new Error('Todos los proveedores fallaron.');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// src/routes/analyses.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" }); // dossier temporaire pour fichiers

// Extraction CLO du syllabus
router.post("/syllabus", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Appelle le script Python
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../../Project_Exams/extraction_competences.py"),
      filePath,
    ]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      // Efface le fichier temporaire après
      fs.unlinkSync(filePath);

      // Suppose que le script retourne du JSON sur stdout
      try {
        const result = JSON.parse(output);
        res.json({ clo: result.clo || result });
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing Python output", raw: output });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// Extraction questions examen
router.post("/exam", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../project_exams/extract_exam.py"),
      filePath,
    ]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      fs.unlinkSync(filePath);

      try {
        const result = JSON.parse(output);
        res.json({ questions: result.questions || result });
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing Python output", raw: output });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// Analyse croisée
router.post("/analyze", upload.fields([{ name: "syllabus" }, { name: "exam" }]), async (req, res) => {
  try {
    const syllabusPath = req.files["syllabus"][0].path;
    const examPath = req.files["exam"][0].path;

    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../../Project_Exams/extraction_competences.py"),
      syllabusPath,
      examPath,
    ]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      // Efface les fichiers temporaires
      fs.unlinkSync(syllabusPath);
      fs.unlinkSync(examPath);

      try {
        const result = JSON.parse(output);
        res.json({ report: result });
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing Python output", raw: output });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;

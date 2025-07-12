// src/routes/analyses.js
const Analysis = require("../models/analysis");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticateToken, isAdmin } = require("../middlewares/auth");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" }); // dossier temporaire pour fichiers

// GET all analyses (admin: tout, user: seulement les siennes)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const all = await Analysis.findAll({
      where,
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des analyses" });
  }
});

// GET one analysis
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }]
    });
    // Sécurité: user non admin ne peut voir que ses analyses
    if (!analysis || (req.user.role !== 'admin' && analysis.userId !== req.user.id)) {
      return res.status(404).json({ error: "Analyse non trouvée" });
    }
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'analyse" });
  }
});

// DELETE one analysis (admin ou owner)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findByPk(req.params.id);
    if (!analysis || (req.user.role !== 'admin' && analysis.userId !== req.user.id)) {
      return res.status(404).json({ error: "Analyse non trouvée" });
    }
    await Analysis.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression analyse" });
  }
});

// Extraction CLO du syllabus (UPLOAD UN PDF)
router.post("/syllabus", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../../Project_Exams/extraction_competences.py"),
      filePath,
    ]);
    let output = "";
    pythonProcess.stdout.on("data", (data) => { output += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { console.error(`PYTHON stderr: ${data}`); });
    pythonProcess.on("close", async (code) => {
      fs.unlinkSync(filePath);
      try {
        const lines = output.trim().split('\n');
        const last = lines[lines.length - 1];
        const result = JSON.parse(last);
        await Analysis.create({
          type: "syllabus",
          filename: req.file.originalname,
          result: result.clo || result,
          userId: req.user.id
        });
        res.json({ clo: result.clo || result });
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing Python output", raw: output });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});


// Extraction questions examen (UPLOAD UN PDF examen)
router.post("/exam", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    // Cherche le dernier syllabus (compétences CLO) de l'utilisateur
    const lastSyllabus = await Analysis.findOne({
      where: { type: "syllabus", userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });
    if (!lastSyllabus) {
      return res.status(400).json({ error: "Vous devez d'abord extraire les CLOs du syllabus." });
    }

    // Génère un fichier temporaire compétences.txt
    const cloPath = "uploads/clo_tmp_exam.txt";
    fs.writeFileSync(cloPath, lastSyllabus.result.join("\n"), "utf-8");

    // Chemin du PDF exam uploadé
    const filePath = req.file.path;
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../../Project_Exams/declinaison_examen_competences.py"),
      filePath, cloPath,
    ]);
    let output = "";
    pythonProcess.stdout.on("data", (data) => { output += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { console.error(`PYTHON stderr: ${data}`); });
    pythonProcess.on("close", async (code) => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(cloPath);
      try {
        const lines = output.trim().split('\n');
        const last = lines[lines.length - 1];
        const result = JSON.parse(last);
        await Analysis.create({
          type: "exam",
          filename: req.file.originalname,
          result: result.questions || result,
          userId: req.user.id
        });
        res.json({ questions: result.questions || result });
      } catch (e) {
        res.status(500).json({ error: "Erreur parsing Python output", raw: output });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// Analyse croisée : reçoit syllabusId et examId choisis par l'utilisateur
router.post("/analyze", authenticateToken, async (req, res) => {
  try {
    const { syllabusId, examId } = req.body;
    if (!syllabusId || !examId) {
      return res.status(400).json({ error: "syllabusId et examId obligatoires" });
    }
    // Cherche les analyses correspondantes (sécurité : appartient à l'utilisateur ou admin)
    const syllabus = await Analysis.findOne({
      where: { id: syllabusId },
    });
    const exam = await Analysis.findOne({
      where: { id: examId },
    });
    if (!syllabus || !exam) {
      return res.status(404).json({ error: "Syllabus ou Examen non trouvé" });
    }

    // Fichier temporaire CLO
    const cloPath = `uploads/clo_tmp_${syllabusId}.txt`;
    fs.writeFileSync(cloPath, syllabus.result.join("\n"), "utf-8");

    // Fichier temporaire questions
    const questionsPath = `uploads/questions_tmp_${examId}.txt`;
    fs.writeFileSync(questionsPath, exam.result.map(q => {
      const question = q.question || "";
      let comp = "";
      if (Array.isArray(q.competences)) comp = q.competences.join(", ");
      else if (q.competence) comp = q.competence;
      else comp = "Non trouvée";
      const niveau = q.niveau_bloom || "Inconnu";
      return `Question : ${question}\n-> Compétence : ${comp}\n-> Niveau Bloom : ${niveau}\n`;
    }).join("\n"), "utf-8");

    // Appelle le script Python
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../../Project_Exams/eval_examen.py"),
      questionsPath, cloPath
    ]);
    let output = "";
    pythonProcess.stdout.on("data", (data) => { output += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { console.error(`PYTHON stderr: ${data}`); });
    pythonProcess.on("close", async (code) => {
      fs.unlinkSync(cloPath);
      fs.unlinkSync(questionsPath);
      try {
        const lines = output.trim().split('\n');
        const last = lines[lines.length - 1];
        const result = JSON.parse(last);
        await Analysis.create({
          type: "analyze",
          filename: `analyse_corres_${syllabusId}_${examId}`,
          result: result,
          userId: req.user.id
        });
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

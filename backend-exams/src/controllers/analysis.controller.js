const Analysis = require('../models/analysis');
const User = require('../models/user');
const pythonRunner = require('../utils/pythonRunner');
const path = require('path');

exports.create = async (req, res) => {
  // Fichier reçu via req.file (multer) ou req.body
  const { type } = req.body;
  // Ex: "exam" ou "syllabus"
  // Pour l'exemple, on imagine que le fichier a été uploadé en local
  const filePath = req.file ? req.file.path : null;
  // On lance le script python avec le chemin du fichier
  const result = await pythonRunner.runPythonScript(type, filePath);
  // Sauvegarder l'analyse
  const analysis = await Analysis.create({
    type,
    filename: filePath,
    result,
    userId: req.user.id
  });
  res.status(201).json({ message: "Analyse enregistrée", analysis });
};

exports.list = async (req, res) => {
  const analyses = await Analysis.findAll({
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']]
  });
  res.json(analyses);
};

exports.detail = async (req, res) => {
  const { id } = req.params;
  const analysis = await Analysis.findByPk(id, {
    include: [{ model: User, attributes: ['id', 'name', 'email'] }]
  });
  if (!analysis) return res.status(404).json({ error: "Not found" });
  res.json(analysis);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Analysis.destroy({ where: { id } });
  res.json({ message: "Analysis deleted" });
};

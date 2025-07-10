const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user');

const Analysis = sequelize.define('Analysis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('exam', 'syllabus'), allowNull: false },
  filename: { type: DataTypes.STRING },
  result: { type: DataTypes.JSON }, // Résultat de l'analyse
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Analysis.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Analysis, { foreignKey: 'userId' });

module.exports = Analysis;

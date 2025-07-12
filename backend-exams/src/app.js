require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');
const userRoutes = require('./routes/user.routes');
const analysesRoutes = require('./routes/analyses.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/analyses', analysesRoutes);

app.get('/', (req, res) => res.send('API running'));

(async () => {
  try {
    await sequelize.sync();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();

module.exports = app;

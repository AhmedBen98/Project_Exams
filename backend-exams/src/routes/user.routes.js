const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Auth public
router.post('/register', controller.register);
router.post('/login', controller.login);

// CRUD admin
router.get('/', authenticateToken, isAdmin, controller.list);
router.put('/:id', authenticateToken, isAdmin, controller.update);
router.delete('/:id', authenticateToken, isAdmin, controller.delete);

module.exports = router;

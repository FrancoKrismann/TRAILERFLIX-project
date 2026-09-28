const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/');
router.post('/');
router.put('/:id');
router.delete('/:id');

module.exports = router;

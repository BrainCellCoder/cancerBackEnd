const express = require('express');
const router = express.Router();
const { insertMembers } = require('../controllers/memberController.js');

// Route to handle insertion of multiple members
router.post('/members', insertMembers);

module.exports = router;

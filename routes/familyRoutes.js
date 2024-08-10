const express = require('express');
const router = express.Router();
const { insertFamilyData } = require('../controllers/familyControllers'); // Adjust the path as needed

// Route to insert family data
router.post('/families', insertFamilyData);

module.exports = router;

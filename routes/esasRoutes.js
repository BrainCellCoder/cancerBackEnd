const express = require('express');
const { insertEsasData } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData);

module.exports = router;

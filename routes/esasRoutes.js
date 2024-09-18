const express = require('express');
const { insertEsasData, getAllEsasData } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData).get("/esas", getAllEsasData);

module.exports = router;

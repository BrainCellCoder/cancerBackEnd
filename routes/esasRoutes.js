const express = require('express');
const { insertEsasData, getAllEsasData, getPatientDataById } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData).get('/esas', getPatientDataById).get("/esas/all", getAllEsasData)

module.exports = router;

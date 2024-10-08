const express = require('express');
const { insertEsasData, getAllEsasData, getPatientDataById, searchById } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData).get('/esas', getPatientDataById).get("/esas/all", getAllEsasData).get("/esas/getName", searchById)

module.exports = router;

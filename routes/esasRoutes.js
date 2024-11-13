const express = require('express');
const { insertEsasData, getAllEsasData, getPatientDataById, login } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData).get('/esas', getPatientDataById).get("/esas/all", getAllEsasData).post("/esas/login", login)

module.exports = router;

const express = require('express');
const { insertEsasData, getAllEsasData, getPatientDataById, login, createPassword,getPassword } = require('../controllers/esasControllers');
const router = express.Router();

router.post('/esas',insertEsasData).get('/esas', getPatientDataById).get("/esas/all", getAllEsasData).post("/esas/login", login).post("/esas/create-password", createPassword).get("/esas/get-password", getPassword)

module.exports = router;

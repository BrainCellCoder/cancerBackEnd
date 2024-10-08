// const Esas = require('../models/esasModel');

// const insertEsasData = async (req, res) => {
//     try {
//         const data = req.body;

//         const result = await Esas.create(data);
//         console.log(result)
//         res.status(201).json({
//             message: 'Record added successfully',
//             data: result
//         });
//     } catch (error) {
//         console.error('Error inserting esas data:', error);
//         res.status(500).json({
//             message: 'Error inserting esas data',
//             error: error.message
//         });
//     }
// };

// const getAllEsasData = async (req, res) => {
//     try {
//         const result = await Esas.find({});
//         console.log(result)
//         res.status(201).json({
//             message: 'All Record Found',
//             data: result
//         });
//     } catch (error) {
//         console.error('Error getting esas data:', error);
//         res.status(500).json({
//             message: 'Error getting esas data',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     insertEsasData,
//     getAllEsasData
// };


const sql = require('mssql'); // Ensure you've required the SQL package
const config = require('../config');
// const insertEsasData = async (req, res) => {
//     try {
//         const data = req.body;
//         console.log(data)
//         // Connect to the database
//         await sql.connect(config);

//         // Example: Assuming the table has 'name' and 'age' columns
//         const result = await sql.query`INSERT INTO Test (P_NAME) VALUES (${data.patientName})`;
        
//         res.status(201).json({
//             message: 'Record added successfully',
//             data: result.rowsAffected
//         });
//     } catch (error) {
//         console.error('Error inserting esas data:', error);
//         res.status(500).json({
//             message: 'Error inserting esas data',
//             error: error.message
//         });
//     } finally {
//         // Close the connection
//         await sql.close();
//     }
// };

const insertEsasData = async (req, res) => {
    try {
        const data = req.body;
        let result;
        await sql.connect(config);

        const existingPatient = await sql.query`SELECT * FROM EPROPatients WHERE patientID = ${data.patientID}`;

        if (existingPatient.recordset.length === 0) {
            const patientInsertResult = await sql.query`INSERT INTO EPROPatients (patientName, patientID, admissionDate, dischargeDate) 
                VALUES (${data.patientName}, ${data.patientID.toUpperCase()}, ${data.admissionDate}, ${data.dischargeDate});`;
             console.log('Patient inserted:', patientInsertResult.rowsAffected);
        } else {
            console.log('Patient already exists, proceeding to insert symptoms.');
        }

        for (const symptom of data.symptoms) {
             result = await sql.query`INSERT INTO EPROPatientSymptoms (patientID, symptomType, addDay, score, symptomBurden) 
                VALUES (${data.patientID.trim()}, ${symptom.symptomType.trim()}, ${symptom.addDay.trim()}, ${symptom.score.trim()}, ${symptom.symptomBurden.trim()});`;
        }

        console.log('Symptoms inserted successfully.');
        res.status(201).json({
            message: 'Record added successfully',
            data: result.rowsAffected
        });

    } catch (error) {
        console.error('Error inserting patient and symptoms:', error);
        res.status(500).json({
            message: 'Error inserting data',
            error: error.message
        });
    } finally {
        await sql.close();
    }
};

const getAllEsasData = async (req, res) => {
    try {
        await sql.connect(config);

        // Query to get all patients and their symptoms
        const patientsResult = await sql.query`
            SELECT p.patientID, p.patientName, p.admissionDate, p.dischargeDate, 
                   s.symptomType, s.addDay, s.score, s.symptomBurden
            FROM EPROPatients AS p
            LEFT JOIN EPROPatientSymptoms AS s ON p.patientID = s.patientID
        `;

        // Check if any patients exist
        if (patientsResult.recordset.length === 0) {
            return res.status(404).json({
                message: 'No patients found.'
            });
        }

        // Process results to group symptoms by patient
        const patients = patientsResult.recordset.reduce((acc, row) => {
            const patientID = row.patientID;

            // If patientID is not already in the accumulator, create a new patient object
            if (!acc[patientID]) {
                acc[patientID] = {
                    patientID: patientID,
                    patientName: row.patientName,
                    admissionDate: row.admissionDate,
                    dischargeDate: row.dischargeDate,
                    symptoms: []
                };
            }

            // If symptomType exists, add the symptom to the patient's symptoms array
            if (row.symptomType) {
                acc[patientID].symptoms.push({
                    symptomType: row.symptomType,
                    addDay: row.addDay,
                    score: row.score,
                    symptomBurden: row.symptomBurden
                });
            }

            return acc;
        }, {});

        // Convert the object to an array
        const result = Object.values(patients);

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: result
        });

    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({
            message: 'Error retrieving data',
            error: error.message
        });
    } finally {
        await sql.close();
    }
};

const getPatientDataById = async (req, res) => {
    const patientID = req.params.id; // Assume patient ID is passed as a route parameter

    if (!patientID) {
        return res.status(400).json({
            message: 'Patient ID is required.'
        });
    }

    try {
        await sql.connect(config);

        // Query to get a specific patient and their symptoms
        const patientResult = await sql.query`
            SELECT p.patientID, p.patientName, p.admissionDate, p.dischargeDate, 
                   s.symptomType, s.addDay, s.score, s.symptomBurden
            FROM EPROPatients AS p
            LEFT JOIN EPROPatientSymptoms AS s ON p.patientID = s.patientID
            WHERE p.patientID = ${patientID}
        `;

        // Check if the patient exists
        if (patientResult.recordset.length === 0) {
            return res.status(404).json({
                message: 'No patient found with the provided ID.'
            });
        }

        // Process results to group symptoms by patient
        const row = patientResult.recordset[0];
        const patientData = {
            patientID: row.patientID,
            patientName: row.patientName,
            admissionDate: row.admissionDate,
            dischargeDate: row.dischargeDate,
            symptoms: []
        };

        // Add symptoms if they exist
        patientResult.recordset.forEach(row => {
            if (row.symptomType) {
                patientData.symptoms.push({
                    symptomType: row.symptomType,
                    addDay: row.addDay,
                    score: row.score,
                    symptomBurden: row.symptomBurden
                });
            }
        });

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: patientData
        });

    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({
            message: 'Error retrieving data',
            error: error.message
        });
    } finally {
        await sql.close();
    }
};




module.exports = {
    insertEsasData,
    getAllEsasData,
    getPatientDataById
};

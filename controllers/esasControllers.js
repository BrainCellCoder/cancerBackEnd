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
                VALUES (${data.patientName}, ${data.patientID}, ${data.admissionDate}, ${data.dischargeDate});`;
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
        // Connect to the database
        await sql.connect(config);

        const result = await sql.query`SELECT * FROM Test`;
        
        console.log(result);
        res.status(200).json({
            message: 'All records found',
            data: result.recordset // Use recordset for the results
        });
    } catch (error) {
        console.error('Error getting esas data:', error);
        res.status(500).json({
            message: 'Error getting esas data',
            error: error.message
        });
    } finally {
        // Close the connection
        await sql.close();
    }
};

module.exports = {
    insertEsasData,
    getAllEsasData
};

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

const login = async (req,res) =>{
    try{
        const {patientID, password} = req.body;
        console.log(patientID, password)
        await sql.connect(config);
        const result = await sql.query`SELECT first_name, mid_name, last_name FROM patientDetails WHERE case_no = ${patientID} and eproPassword = ${password}`;
        const p_data = result.recordset[0];
        console.log(p_data)
        if (!p_data) {
            return res.status(404).json({
                message: 'ERROR: Wrong ID or Password',
                success: false
            });
        }
        res.status(201).json({
            message: 'Record Found',
            data: p_data
        });
    }catch(error){
        console.error('Error getting patient details: ', error);
        res.status(500).json({
            success: false,
            message: 'Error getting patient details: ' + error.message,
        });
    }
}

const insertEsasData = async (req, res) => {
    try {
        const data = req.body;
        if(!data.patientID || !data.password){
            return res.status(404).json({
                message: 'ERROR: Password and ID is required to perform this operation',
                success: false
            });
        }
        let result;
        await sql.connect(config);

        const authResult = await sql.query`SELECT * FROM patientDetails WHERE case_no = ${data.patientID} and eproPassword = ${data.password}`;
        if (!authResult.recordset || authResult.recordset.length === 0) {
            return res.status(404).json({
                message: 'ERROR: Please login first',
                success: false
            });
        }

        const existingPatient = await sql.query`SELECT * FROM EPROPatients WHERE patientID = ${data.patientID}`;

        if (existingPatient.recordset.length === 0) {
            const patientInsertResult = await sql.query`INSERT INTO EPROPatients (patientName, patientID, admissionDate, dischargeDate, enteredDate, enteredTime) 
                VALUES (${data.patientName}, ${data.patientID.toUpperCase()}, ${data.admissionDate}, ${data.dischargeDate}, ${data.enteredDate}, ${data.enteredTime});`;
             console.log('Patient inserted:', patientInsertResult.rowsAffected);
        } else {
            console.log('Patient already exists, proceeding to insert symptoms.');
        }

        for (const symptom of data.symptoms) {
             result = await sql.query`INSERT INTO EPROPatientSymptoms (patientID, symptomType, addDay, score, symptomBurden, enteredDate, enteredTime) 
                VALUES (${data.patientID.trim()}, ${symptom.symptomType.trim()}, ${symptom.addDay.trim()}, ${symptom.score.trim()}, ${symptom.symptomBurden.trim()}, ${symptom.enteredDate}, ${symptom.enteredTime});`;
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
                   s.symptomType, s.addDay, s.score, s.symptomBurden, s.enteredDate, s.enteredTime
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
                    symptomBurden: row.symptomBurden,
                    enteredDate: row.enteredDate,
                    enteredTime: row.enteredTime,
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
    const patientID = req.query.id; // Assume patient ID is passed as a route parameter

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
                   s.symptomType, s.addDay, s.score, s.symptomBurden,s.enteredDate, s.enteredTime
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
                    symptomBurden: row.symptomBurden,
                    enteredDate: row.enteredDate,
                    enteredTime: row.enteredTime,
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

const getPassword = async(req,res) =>{
    const caseno = req.query.caseno;
  if (!caseno) {
    return res.status(400).json({ message: "Invalid input: Case number is required." });
  }
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT eproPassword FROM dbo.patientDetails WHERE CASE_NO = ${caseno}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Password not found for this case number." });
    }

    const password = result.recordset[0].eproPassword;
    return res.status(200).json({ password: password });
  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  } finally {
    await sql.close();
  }
}

const createPassword = async (req,res) =>{
    const { newPassword, caseno } = req.body;

    if (!newPassword || !caseno) {
      return res.status(400).json({ message: "Invalid input" });
    }
  
    try {
      await sql.connect(config);
  
      const result = await sql.query`SELECT eproPassword FROM dbo.patientDetails WHERE CASE_NO = ${caseno}`;
  
      if (result.recordset.length > 0 && result.recordset[0].eproPassword) {
        return res.status(400).json({ message: "Password already exists for this case number." });
      }
  
      const updateResult = await sql.query`UPDATE dbo.patientDetails SET eproPassword = ${newPassword} WHERE CASE_NO = ${caseno}`;
  
      if (updateResult.rowsAffected > 0) {
        return res.status(200).json({ message: "Password updated successfully." });
      } else {
        return res.status(400).json({ message: "Error updating password. Case number may not exist." });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error: " + err.message });
    } finally {
      await sql.close();
    }
}


module.exports = {
    login,
    insertEsasData,
    getAllEsasData,
    getPatientDataById,
    createPassword,
    getPassword
};

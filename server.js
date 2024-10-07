// const mongoose = require("mongoose");
// mongoose.set("strictQuery",false);
 require("dotenv").config({path: "./.env"});
 const app = require("./index");

// const DB = process.env.DB_URI;
// mongoose.connect(DB).then((con) =>{
//     console.log("DB connected successfully");
// }).catch((e)=>{
//     console.log(e);
// })

// const port = process.env.PORT || 8000;
// app.listen(port , () =>{
//     console.log(`listening on port ${port}...`);
// })

const sql = require('mssql');
const config = require('./config');
async function connectToDatabase() {
    try {
        // Connect to the database
        await sql.connect(config);
        console.log('Connected to the database!');

        const result = await sql.query`SELECT * FROM Test`;
        console.log(result.recordset);

    } catch (err) {
        console.error('Database connection failed:', err);
    } finally {
        // Close the connection
        // await sql.close();
    }
}



const port = process.env.PORT || 8000;
app.listen(port , () =>{
    console.log(`listening on port ${port}...`);
    connectToDatabase();
})




// const insertPatientAndSymptoms = async (data) => {
//     try {
//         await sql.connect(config);

//         // Check if patient exists
//         const existingPatient = await sql.query`SELECT * FROM Patients WHERE patientID = ${data.patientID}`;

//         if (existingPatient.recordset.length === 0) {
//             // Patient does not exist, insert new patient record
//             const patientInsertResult = await sql.query`INSERT INTO Patients (patientName, patientID, admissionDate, dischargeDate) 
//                 VALUES (${data.patientName}, ${data.patientID}, ${data.admissionDate}, ${data.dischargeDate});`;
//             console.log('Patient inserted:', patientInsertResult.rowsAffected);
//         } else {
//             console.log('Patient already exists, proceeding to insert symptoms.');
//         }

//         // Insert symptoms
//         for (const symptom of data.symptoms) {
//             await sql.query`INSERT INTO Symptoms (patientID, symptomType, addDay, score, symptomBurden) 
//                 VALUES (${data.patientID}, ${symptom.symptomType}, ${symptom.addDay}, ${symptom.score}, ${symptom.symptomBurden});`;
//         }

//         console.log('Symptoms inserted successfully.');
//         return {
//             status: 201,
//             message: 'Patient and symptoms processed successfully.',
//         };

//     } catch (error) {
//         console.error('Error inserting patient and symptoms:', error);
//         return {
//             status: 500,
//             message: 'Error inserting patient and symptoms',
//             error: error.message,
//         };
//     } finally {
//         await sql.close();
//     }
// };

// // Example usage
// const data = {
//     patientName: 'John Doe',
//     patientID: 'P12345', // Unique patient ID
//     admissionDate: new Date('2024-10-01'),
//     dischargeDate: new Date('2024-10-10'),
//     symptoms: [
//         { symptomType: 'Cough', addDay: '2024-10-02', score: 2, symptomBurden: 5 },
//         { symptomType: 'Fever', addDay: '2024-10-03', score: 3, symptomBurden: 6 },
//     ],
// };

// insertPatientAndSymptoms(data)
//     .then(response => {
//         console.log(response.message);
//     })
//     .catch(error => {
//         console.error(error.message);
//     });



// CREATE TABLE Patients (
//     id INT PRIMARY KEY IDENTITY(1,1),  -- Auto-incremented primary key
//     patientName NVARCHAR(100) NOT NULL,
//     patientID NVARCHAR(50) NOT NULL UNIQUE,
//     admissionDate DATETIME NOT NULL,
//     dischargeDate DATETIME
// );

// CREATE TABLE Symptoms (
//     id INT PRIMARY KEY IDENTITY(1,1),  -- Auto-incremented primary key
//     patientID NVARCHAR(50) NOT NULL,
//     symptomType NVARCHAR(100) NOT NULL,
//     addDay DATE NOT NULL,
//     score INT,
//     symptomBurden INT,
//     FOREIGN KEY (patientID) REFERENCES Patients(patientID)  -- Establishes a relationship
// );

const Family = require('../models/familyModel'); // Adjust the path as needed

// Controller function to insert family data
const insertFamilyData = async (req, res) => {
    try {
        const data = req.body; // Expecting an array of family objects or a single object
        
        // Check if the data is an array
        if (Array.isArray(data)) {
            // Insert multiple documents
            const result = await Family.insertMany(data);
            console.log(result)
            res.status(201).json({
                message: 'Families added successfully',
                data: result
            });
        } else {
            // Insert a single document
            const result = await Family.create(data);
            console.log(result)
            res.status(201).json({
                message: 'Family added successfully',
                data: result
            });
        }
    } catch (error) {
        console.error('Error inserting family data:', error);
        res.status(500).json({
            message: 'Error inserting family data',
            error: error.message
        });
    }
};

module.exports = {
    insertFamilyData
};

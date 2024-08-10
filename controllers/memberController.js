
const Member = require('../models/memberModel'); // Adjust the path based on your project structure

// Insert multiple members
exports.insertMembers = async (req, res) => {
    try {
        const data = req.body; // Assuming req.body contains an array of member objects

        if (Array.isArray(data)) {
            const result = await Member.insertMany(data);
            console.log(result)
            res.status(201).json({
                message: 'Families added successfully',
                data: result
            });
        } else {
            const result = await Member.create(data);
            console.log(result)
            res.status(201).json({
                message: 'Family added successfully',
                data: result
            });
        }
    } catch (error) {
        console.error('Error inserting members:', error);
        res.status(500).json({ success: false, message: 'Error inserting members' });
    }
};

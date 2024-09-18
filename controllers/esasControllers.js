const Esas = require('../models/esasModel');

const insertEsasData = async (req, res) => {
    try {
        const data = req.body;

        const result = await Esas.create(data);
        console.log(result)
        res.status(201).json({
            message: 'Esas Record added successfully',
            data: result
        });
    } catch (error) {
        console.error('Error inserting esas data:', error);
        res.status(500).json({
            message: 'Error inserting esas data',
            error: error.message
        });
    }
};

const getAllEsasData = async (req, res) => {
    try {
        const result = await Esas.find({});
        console.log(result)
        res.status(201).json({
            message: 'All Esas Record Found',
            data: result
        });
    } catch (error) {
        console.error('Error getting esas data:', error);
        res.status(500).json({
            message: 'Error getting esas data',
            error: error.message
        });
    }
};

module.exports = {
    insertEsasData,
    getAllEsasData
};

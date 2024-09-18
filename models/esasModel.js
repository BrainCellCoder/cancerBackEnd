const mongoose = require("mongoose");

const esasSchema = mongoose.Schema({
    patientName:{
        type: String,
        trim: true
    },
    painAddDay:{
        type: String,
        trim: true
    },
    painScore:{
        type: String,
        trim: true
    },
    painSymptomBurden:{
        type: String,
        trim: true
    },
    fatigueAddDay:{
        type: String,
        trim: true
    },
    fatigueScore:{
        type: String,
        trim: true
    },
    fatigueSymptomBurden:{
        type: String,
        trim: true
    },
    nauseaVomitAddDay:{
        type: String,
        trim: true
    },
    nauseaVomitScore:{
        type: String,
        trim: true
    },
    nauseaVomitSymptomBurden:{
        type: String,
        trim: true
    },
    drowsinessAddDay:{
        type: String,
        trim: true
    },
    drowsinessScore:{
        type: String,
        trim: true
    },
    drowsinessSymptomBurden:{
        type: String,
        trim: true
    },
    appetiteAddDay:{
        type: String,
        trim: true
    },
    appetiteScore:{
        type: String,
        trim: true
    },
    appetiteSymptomBurden:{
        type: String,
        trim: true
    },
    breathingDiffAddDay:{
        type: String,
        trim: true
    },
    breathingDiffScore:{
        type: String,
        trim: true
    },
    breathingDiffSymptomBurden:{
        type: String,
        trim: true
    },
    wellBeingAddDay:{
        type: String,
        trim: true
    },
    wellBeingScore:{
        type: String,
        trim: true
    },
    wellBeingSymptomBurden:{
        type: String,
        trim: true
    },
    seizuresAddDay:{
        type: String,
        trim: true
    },
    seizuresScore:{
        type: String,
        trim: true
    },
    seizuresSymptomBurden:{
        type: String,
        trim: true
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model("Esas", esasSchema)
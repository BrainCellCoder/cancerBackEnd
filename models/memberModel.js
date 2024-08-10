const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
    personID:{
        type: String,
        trim: true
    },
    familyID:{
        type: String,
        trim: true
    },
    name:{
        type: String,
        trim: true
    },
    detailsSharedBy:{
        type: String,
        trim: true
    },
    presentInSameAdd:{
        type: String,
        trim: true
    },
    isYesWhere:{
        type: String,
        trim: true
    },
    age:{
        type: String,
        trim: true
    },
    gender:{
        type: String,
        trim: true
    },
    phNo:{
        type: String,
        trim: true
    },
    education:{
        type: String,
        trim: true
    },
    medHistory:{
        type: String,
        trim: true
    },
    earningMember:{
        type: String,
        trim: true
    },
    occupation:{
        type: String,
        trim: true
    },
    salary:{
        type: String,
        trim: true
    },
    cancerHistory:{
        type: String,
        trim: true
    },
    whenDiagnosed:{
        type: String,
        trim: true
    },
    whichSite:{
        type: String,
        trim: true
    },
    conditionNow:{
        type: String,
        trim: true
    },
    lastTimeHospVisitForCancer:{
        type: String,
        trim: true
    },
    whereKnowAboutCancer:{
        type: String,
        trim: true
    },
    howCancerCaused:{
        type: String,
        trim: true
    },
    awareSymptoms:{
        type: String,
        trim: true
    },
    ifYesWhatSymptoms:{
        type: String,
        trim: true
    },
    cancerCommunicable:{
        type: String,
        trim: true
    },
    awareCancerScreening:{
        type: String,
        trim: true
    },
    cancerTreatable:{
        type: String,
        trim: true
    },
    foodHabit:{
        type: String,
        trim: true
    },
    waterSource:{
        type: String,
        trim: true
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model("Member", memberSchema)

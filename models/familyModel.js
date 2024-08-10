const mongoose = require("mongoose");

const familySchema = mongoose.Schema({
    familyID:{
        type: String,
        trim: true
    },
    currentAddress:{
        type: String,
        trim: true
    },
    parmentAddress:{
        type: String,
        trim: true
    },
    houseNo:{
        type: String,
        trim: true
    },
    religion:{
        type: String,
        trim: true
    },
    socialGroup:{
        type: String,
        trim: true
    },
    socialGroupOther:{
        type: String,
        trim: true
    },
    familyHead:{
        type: String,
        trim: true
    },
    remark:{
        type: String,
        trim: true
    },
    latitude:{
        type: String,
        trim: true
    },
    longitude:{
        type: String,
        trim: true
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model("Family", familySchema)
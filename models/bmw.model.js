import mongoose from 'mongoose';

const bmwSchema = new mongoose.Schema({
    modelName:{
        type: String,
        required: [true, 'Model name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },

    chassisCode:{
        type: String,
        required:[true, 'Chassis code is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    powertrainType:{
        type: String,
        required:[true, 'Power type is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    engineCode:{
        type: String,
        required:[true, 'Engine code is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    horsePower:{
        type: Number,
        required: [true, 'Horse power is required'],
        validate: {
            validator: v => v >= 10 && v <= 9999,
            message: 'Horse power must be between 2 and 4 digits'
        }
    },

    zeroToSixty:{
        type: Number,
        required:false,
}
},
{timestamps:true}
)

const bmw = new mongoose.model('bmw', bmwSchema);

export default bmw;
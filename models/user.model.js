import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,required:[true, 'Username is required'],
        trim:true,
        minLength:2,
        maxLength:20,
    },

    email:{
        type:String,
        unique:[true, 'Email is required'],
        trim:true,
        lowercase:true,
        match:[/\S+@\S+\.\S+/, 'Please enter a valid email address.'], //validate email using a regex
    },

    password:{
        type:String,
        required:true,
        minLength:8,
    }

},
{ timestamps:true }
);

const User = mongoose.model('User', userSchema);

export default User;
const mongoose = require('mongoose');

// Use a connection string in quotes
const MONGO_URI = 'mongodb+srv://utkarshpbscit:vyNjoQHgwS03aBbO@cluster0.ej2jna4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    age: { 
        type: Number, 
        min: 0 
    }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);

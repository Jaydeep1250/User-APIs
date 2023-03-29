const mongoose = require('mongoose');

//gasPurchases
const Users = new mongoose.Schema({}, { collection: 'users', strict: false });
const User = mongoose.model("users", Users);

/* const User = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }); */
module.exports = {
    User
};
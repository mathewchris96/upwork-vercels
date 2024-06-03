const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyUrl: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL');
            }
        }
    },
    rolesHiringFor: {
        type: String,
        required: true,
        trim: true
    }
});

// Hash the plain text password before saving
employerSchema.pre('save', async function (next) {
    const employer = this;
    if (employer.isModified('password')) {
        employer.password = await bcrypt.hash(employer.password, 8);
    }
    next();
});

// Generate an auth token for the employer
employerSchema.methods.generateAuthToken = async function () {
    const employer = this;
    const token = jwt.sign({ _id: employer._id.toString() }, 'secretkey');
    return token;
};

// Find employer by credentials
employerSchema.statics.findByCredentials = async (email, password) => {
    const employer = await Employer.findOne({ email });
    if (!employer) {
        console.log('No employer found with that email');
        throw new Error('No employer found with that email');
    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
        console.log('Wrong Password entered');
        throw new Error('Wrong Password entered');
    }
    return employer;
};

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;

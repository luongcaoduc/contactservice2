const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    owner: {
        type: Number,
        required: true,
    }
})



const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact
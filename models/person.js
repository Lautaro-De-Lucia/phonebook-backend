//  1. WE INCLUDE DATABASE HELPER LIBRARIES
const mongoose = require('mongoose')

//  2.  WE DEFINE THE DATABASE URL
const url = process.env.MONGODB_URI

//  3.  WE ATTEMPT CONNECTION TO THE DATABASE
mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//  4. WE DEFINE THE SCHEMA 
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

//  5. WE RE-DEFINE THE SCHEMA (OPTIONAL)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//  6.  WE SET THE VALUE OF THE MODULE.EXPORTS VARIABLE TO THE MONGOOSE CONSTRUCTOR
module.exports = mongoose.model('Person', personSchema)

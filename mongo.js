const mongoose = require('mongoose')

//  1. SETUP CMD ARGUMENTS:
if (process.argv.length < 3) {
    console.log('Please provide the password as the first argument')
    console.log('Then phone as second argument and name as third argument')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://mongofso:${password}@cluster0.5fuccau.mongodb.net/phonebookApp?retryWrites=true&w=majority`

//  2. WE DEFINE THE SCHEMA & MATCHING MODEL
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

//  3. WE ESTABLISH CONNECTION TO DATABASE
mongoose.connect(url).then((result) => {

    console.log('Succesfully connected to database')

    if (process.argv.length == 5) {
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })
        person.save().then(result => {
            console.log('added ' + result.name + ' number ' + result.number + ' to phonebook')
            mongoose.connection.close()
        })
    }

    if (process.argv.length == 3) {
        console.log('phonebook:')
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person.name + ' ' + person.number)
            })
            mongoose.connection.close()
        })
    }

}).catch((err) => console.log(err))
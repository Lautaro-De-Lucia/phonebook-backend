require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(errorHandler)

// UTILITIES
const generateId = () => {
    const newId = Math.floor(Math.random() * 1000)
    return newId
}

// REQUESTS
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`Phonebook has info for ${Person.countDocuments.length} people <br/>${date}`)
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(person => {
        response.json(person)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log('The persons name on server:', body.name)
    Person.findOneAndUpdate({ name: body.name }, { number: body.number }, { new: true }).then(person => {
        response.json(person)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    //Person.findOneAndUpdate({ name: body.name }, { number: body.number }, { new: true });
    /*
    Person.find({ 'number': body.number }).count().exec().then(count => {
        if (count > 0) {
            console.log("This number is already held by:" + count + "persons")
            return response.status(400).json({
                error: 'number is already in the phonebook'
            })
        }
    })
    */

    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
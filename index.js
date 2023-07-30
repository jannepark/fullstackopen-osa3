const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Person = require('./models/person')


let persons = [
  // { id: 1, name: 'Arto Hellas', number: '040-123456' },
  // { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  // { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  // { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('body', (req) => JSON.stringify(req.body))
const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(customMorganFormat))

app.get('/', (req, res) => {
  res.send('<h1>Hello World, this is Phonebook!</h1>')
})

app.get('/api/persons', (req, res) => {
  // const body = req.body
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/info', (req, res) => {
  const info = `Phonebook has info for ${persons.length} people `
  const time = new Date().toString()
  res.send(`<p>${info}</p><p>${time}</p>`)
  console.log('request time sent , ', time)
})
app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  console.log('tööt')
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
        .catch(error => next(error))
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
//   const id = Number(request.params.id)

  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//     const randomId = Math.floor(Math.random() * 100000)
//     return randomId
// }

app.post('/api/persons', (request, response, next) => {
  console.log(request.body.name.length)
  const body = request.body
  let person = new Person({
    name: body.name,
    number: body.number
  })


  const reqPersonName = persons.find(person =>
    person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }
  if (reqPersonName) {
    return response.status(400).json({
      error: 'Name already added'
    })
  }
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))


})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // const person = {
  //     name: body.name,
  //     number: body.number,
  // }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3012
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
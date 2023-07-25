const express = require('express')
const morgan = require('morgan')

const app = express()

let persons = [
    { id:1, name: 'Arto Hellas', number: '040-123456' },
    { id:2,name: 'Ada Lovelace', number: '39-44-5323523' },
    { id:3,name: 'Dan Abramov', number: '12-43-234345' },
    { id:4,name: 'Mary Poppendieck', number: '39-23-6423122' }
]
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(customMorganFormat))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/info', (req, res) => {
    const info = `Phonebook has info for ${persons.length} people `
    const time = new Date().toString()
    res.send(`<p>${info}</p><p>${time}</p>`)
    console.log('request time sent , ',time)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
 persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
const generateId = () => {
    const randomId = Math.floor(Math.random() * 100000)
    return randomId
  }
  
app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const body = request.body
    const reqPersonName = persons.find(person => person.name === body.name)
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
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

persons = persons.concat(person)

response.json(person)
})

const PORT = 3012
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')        // <-- Add this line

app.use(express.json())             // Needed to parse JSON bodies
app.use(cors())                     // <-- And this line
app.use(express.static('dist'))

// Custom token to log POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use morgan with custom format including :body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) =>  {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`
    )
})

app.get('/info/:id', (req, res) => {
    const id = req.params.id
    const person = person.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // Check if name or number is missing
    if (!body.name) {
        return res.status(400).json({ error: "name missing" })
    }
    if (!body.number) {
        return res.status(400).json({ error: "number missing" })
    }

    // Check if person already exists by name
    const existingPerson = persons.find(person => person.name === body.name)
    if (existingPerson) {
        return res.status(400).json({ error: "name must be unique" })
    }

    const id = Math.floor(Math.random() * 1000000)
    const person = {
        name: body.name,
        number: body.number,
        id: String(id)
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

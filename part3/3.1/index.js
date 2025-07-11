const express = require('express')
const Note = require('./models/note')

const app = express()
var morgan = require('morgan')
const cors = require('cors')        // <-- Add this line
const PORT = process.env.PORT

app.use(express.json())             // Needed to parse JSON bodies
app.use(cors())                     // <-- And this line
app.use(express.static('dist'))

// Custom token to log POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use morgan with custom format including :body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) =>  {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>`
        )
    })
})

app.get('/info/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note)
        } else {
            res.status(404).end()
        }
    })
})

app.delete('api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
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
    const person = new Person({
        name: body.name,
        number: body.number,
        id: String(id)
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const express = require('express')
const Person = require('./models/person')

const app = express()
var morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Custom token to log POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use morgan with custom format including :body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) =>  {
    Person.find({})
      .then(persons => res.json(persons))
      .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({})
      .then(persons => {
        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>`
        )
      })
      .catch(error => next(error))
})

app.get('/info/:id', (req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: "name missing" })
    }
    if (!body.number) {
        return res.status(400).json({ error: "number missing" })
    }

    Person.findOne({ name: body.name })
      .then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ error: "name must be unique" })
        }

        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save()
          .then(savedPerson => res.json(savedPerson))
          .catch(error => next(error))
      })
      .catch(error => next(error))
})

// Error handler middleware
app.use((error, req, res, next) => {
  console.error(error.message)
  res.status(500).json({ error: 'something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

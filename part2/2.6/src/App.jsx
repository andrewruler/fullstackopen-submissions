import { useState, useEffect } from 'react'
import PersonService from './services/persons'
import './notification.css'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const AddPhone = ({ newName, setNewName, newNumber, setNewNumber, addPerson }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    addPerson({ name: newName, number: newNumber })
    setNewName('')
    setNewNumber('')
  }

  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Person = ({ person, handleRemove }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={handleRemove}>delete</button>
    </p>
  )
}

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={messageType ? messageType : ""}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    PersonService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (personObject) => {
    const existingPerson = persons.find(p => p.name === personObject.name)
    if (existingPerson) {
      if (window.confirm(`${personObject.name} is already added to the phonebook. Update the number?`)) {
        const updatedPerson = { ...existingPerson, number: personObject.number }
        PersonService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setMessage(`Updated ${returnedPerson.name}`)
            setMessageType('confirmation')
            setTimeout(() => {
              setMessage(null)
              setMessageType(null)
            }, 5000)
          })
          .catch(error => {
            setMessage(`Information of ${existingPerson.name} has already been removed from server`)
            setMessageType('error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => {
              setMessage(null)
              setMessageType(null)
            }, 5000)
          })
      }
    } else {
      PersonService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${returnedPerson.name}`)
          setMessageType('confirmation')
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
        })
    }
  }



  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      PersonService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`${name} was already removed from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <Notification message={message} messageType={messageType}></Notification>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <AddPhone
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
          <Person
            key={person.id}
            person={person}
            handleRemove={() => handleRemove(person.id, person.name)}
          />
        )}
      </div>
    </div>
  )
}

export default App

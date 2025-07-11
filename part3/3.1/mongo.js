const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const db_password = process.argv[2]
const db_username = 'andrewruler'
const url = `mongodb+srv://${db_username}:${db_password}@cluster0.i5jrafj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if(process.argv.length > 3) {
      const name = process.argv[3]
      const number = process.argv[4]

      const person = Person({name, number})
      person.save()
      .then(() => {
        console.log(`saved ${person}`)
      })
      .catch(err => {
        console.log('Error saving person:', err)
      })
    }
    Person.find({})
      .then(result => {
        if (result.length === 0) {
          console.log('No persons found in the database.')
        } else {
          result.forEach(note => {
            console.log(note)
          })
        }
        mongoose.connection.close()
      })
      .catch(err => {
        console.error('Error querying persons:', err)
        mongoose.connection.close()
      })
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err)
  })

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//node mongo.js <PASSWORD> <NAME> <NUMBER>
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4] || ''

const url = `mongodb+srv://ash4rkk:${password}@cluster0.j1lnm4r.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number,
})

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log(
      `added ${person.name} ${person.number.length > 0 ? `number ${person.number}` : 'without number'} to phonebook`,
    )
    mongoose.connection.close()
  })
}

const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to ', url)

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDb')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb', error)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        const regex = /^\d{2,3}-\d+$/
        return regex.test(v)
      },
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

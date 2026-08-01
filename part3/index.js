const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 3001

// 3.8 DONE
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]
app.use(express.json())
app.use(cors())
app.use(express.static("dist"))
morgan.token("content", (request, response) => {
  return JSON.stringify(request.body)
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content",
  ),
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "Unknown endpoint",
  })
}

//QF for a browser log
app.get("/favicon.ico", (request, response) => response.status(204).end())

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.send(person)
  } else {
    response.status(404).send("No existing person")
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.get("/info", (request, response) => {
  const date = new Date()
  response.send(`
    <h2>Phonebook has info for ${persons.length} people</h3>
    <h2>${date}</h2>
`)
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0
  return String(maxId + 1)
}

app.put("/api/persons/:id", (request, response) => {
  const body = request.body
  const id = request.params.id

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    })
  }

  const person = persons.find((p) => p.id === id)
  if (!person) {
    return response.status(404).json({
      error: "Person not found",
    })
  }

  const updatedPerson = {
    ...person,
    name: body.name,
    number: body.number,
  }
  persons = persons.map((p) => (p.id === id ? updatedPerson : p))

  response.json(updatedPerson)
})

app.post("/api/persons/", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    })
  }

  const nameExists = persons.find((p) => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({
      error: "Name must be unique",
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

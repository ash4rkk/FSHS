import personService from "./services/persons";
import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import Notification from "./components/Notification";
//2.15 done
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const notification = (message, type = "success") => {
    setMessage({ text: message, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addPerson = (e) => {
    e.preventDefault();
    const nameExists = persons.find((person) => person.name === newName);

    const personObj = {
      name: newName,
      number: newNumber,
    };

    if (nameExists) {
      const confirmWindow = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (confirmWindow) {
        personService
          .update(nameExists.id, personObj)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === nameExists.id ? returnedPerson : person,
              ),
            );
            setNewName("");
            setNewNumber("");
            notification(`Changed number for ${returnedPerson.name}`);
          })
          .catch((error) => {
            notification(
              `Information of ${nameExists.name} has already been removed from server`,
              "error",
            );
            setPersons(persons.filter((person) => person.id !== nameExists.id));
          });
      }
    } else {
      personService
        .create(personObj)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          notification(`Added ${returnedPerson.name}`);
        })
        .catch((error) => {
          notification("Something went wrong", "error");
        });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleDelete = (id) => {
    const deletedPerson = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${deletedPerson.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          notification(`Deleted ${deletedPerson.name}`);
        })
        .catch((error) => {
          notification(
            `Information of ${deletedPerson.name} has already been removed form server.`,
            "error",
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };
  const shownPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={search} onChange={(e) => setSearch(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={shownPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;

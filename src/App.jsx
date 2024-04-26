import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [showingPersons, setShowingPersons] = useState()
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  var personExists = false;
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) =>
  {
    event.preventDefault()
    console.log('button clicked', event.target)
    persons.map(person => 
    {
      if(person.name == newName)
      {
        personExists = true
        return
      }
    })
    if(personExists)
    {
      alert(newName + " already exists!")
      personExists = false
    }
    else
    {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const addPers = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    noteService
    .create(personObject)
    .then(returnedPersons => {
      setPersons(persons.concat(returnedPersons))
      setNewName('')
      setNewNumber('')
    })
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)

    setNewSearch(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.includes(newSearch))

  console.log(personsToShow)

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input onChange={handleSearchChange} value={newSearch}/>
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={handlePersonChange}
          />
        </div>
        <div>number: 
          <input 
            value={newNumber}
            onChange={handleNumberChange}/>
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person, id) => 
          <Person key={id} person={person}/>
        )}
      </ul>
    </div>
  )
}

function Person({person})
{
  
  return(
    <div>
      <p>{person.name} {person.number}</p>
      <button>Delete</button>
    </div>
  )

}

export default App
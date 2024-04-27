import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [showingPersons, setShowingPersons] = useState()
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [errorMsg, setErrorMsg] = useState("")


  var personExists = false;
  var personUpdated = false;


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
    persons.map(person => 
      {
        if(person.name == newName)
        {
          if(person.number == newNumber)
          {
            personExists = true
            return
          }
          else
          {
            if (window.confirm(`${newName} already exists in the phonebook.
                                Replace the old number with a new one`)) 
            {
              const updatedPerson = {name: newName, number: newNumber}
              personService.update(person.id,updatedPerson).then(response =>
                {
                  setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
                  setNewName('')
                  setNewNumber('')
                  setErrorMsg("")
                }
              ).catch(error => {
                // this is the way to access the error message
                setErrorMsg(error.response.data.error);
                console.log(error.response.data.error)
              })
            }
          }
          personUpdated = true
          return
        }
      })
      if(personExists)
      {
        alert(newName + " already exists!")
        personExists = false
      }
      else if(!personUpdated)
      {
        const personObject = {
          name: newName,
          number: newNumber
        }
        personService
        .create(personObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
          setNewNumber('')
          setErrorMsg("")
        }).catch(error => {
          // this is the way to access the error message
          setErrorMsg(error.response.data.error)
          console.log(error.response.data.error)
        })
      }
      personUpdated = false
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

  const deletePersonClicked = (id) =>
  {
    personService.erase(id);
    setPersons(persons.filter(p => p.id !== id))
  }

  const personsToShow = persons.filter(person => person.name.includes(newSearch))

  console.log(personsToShow)

  return (
    <div>
      <p>{errorMsg}</p>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input onChange={handleSearchChange} value={newSearch}/>
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPers}>
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
          <Person key={id} person={person} 
            deletePerson={() => deletePersonClicked(person.id)}/>
        )}
      </ul>
    </div>
  )
}

function Person({person,deletePerson})
{
  
  return(
    <div>
      <p>{person.name} {person.number}
      &ensp; <button onClick={deletePerson}>Delete</button></p>
    </div>
  )

}

export default App
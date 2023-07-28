import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import NewPersonForm from './components/NewPersonForm'
import Filter from './components/Filter'
import numberService from './services/numbers'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    numberService
      .getAll()
      .then(initialNumbers => {
        setPersons(initialNumbers)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newPersonObject.name)) {
      if (window.confirm(
        `${newPersonObject.name} is already added to phonebook, replace the old number with a new one?`)
      ) {
        const duplicatePerson = persons.find((person) =>
          person.name === newPersonObject.name)
        numberService.update(duplicatePerson.id, newPersonObject)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== duplicatePerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({
              message: `Updated number for ${returnedPerson.name}`,
              type: 'notification'
            })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
          }
          )
          .catch(error => {
            setPersons(persons.filter(person => person.id !== duplicatePerson.id))
            setNotification({
              message: `Information of ${duplicatePerson.name} has already been deleted from server`,
              type: 'error'
            })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
          })
      }
    } else {
      numberService
        .create(newPersonObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
          setNewName('')
          setNewNumber('')
          setNotification({
            message: `Added ${returnedObject.name}`,
            type: 'notification'
          })
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
    }

  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const filterPersons = persons.filter(
    (person) => person.name.toLowerCase().includes(newFilter.toLocaleLowerCase())
  )
  const removePerson = (person) => {
    const personToRemove = person
    console.log(personToRemove)
    if (window.confirm(`Delete ${personToRemove.name} ?`))
      numberService.remove(personToRemove.id).then(() => {
        numberService
          .getAll()
          .then(returnedPersons => {
            setPersons(returnedPersons)
            setNotification({
              message: `Deleted ${personToRemove.name}`,
              type: 'notification'
            })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
          })
      })
        .catch(error => {
          setNotification({
            message: `Information of ${personToRemove.name} has already been deleted from server`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
          setPersons(persons.filter(person => person.id !== personToRemove.id))
        })


  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <NewPersonForm addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filterPersons} remove={removePerson} />
    </div>
  )
}

export default App
import Person from './Person'

const Persons = ({persons,remove}) => {
    return (
        <>
            {persons.map(person => 
            <Person key={person.id} 
                person={person} 
                remove={() => remove(person)}
            />)}
        </>
    )

}
export default Persons
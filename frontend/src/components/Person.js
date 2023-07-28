const Person = ({ person, remove}) => {
    return (
    <>
      <li>{person.name} {person.number}</li>
      <button onClick={remove}>Delete</button>
    </>
    )
  }

  export default Person
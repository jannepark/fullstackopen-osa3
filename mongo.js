const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://janneviljo:${password}@cluster0.tn15jpa.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Persons', personSchema)

if(process.argv[3]){
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`Added ${name}`)
        mongoose.connection.close()
    })
}
else {
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(note => {
          console.log(note.name,note.number)
        })
        mongoose.connection.close()
      })
}


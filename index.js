const { request } = require('express');

express = require('express');
const cors = require('cors')
const morgan = require('morgan');

app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(morgan((tokens, req, res) => {
    const requestBody = JSON.stringify(req.body);
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res),'ms',
        requestBody
      ].join(' ')
  }));
  



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const generateId = () => {
    let maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
    return maxId + 1;
}

app.get('/', (request, response) => {
    let date = new Date();
    let stringDate = date.toString();
    response.send(
        `<p>Phone book has info for ${generateId() -1} people</p>
        <p>${stringDate}</p>`   
    );
})


app.get('/api/persons', (request, response) => {
    response.json(persons);
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if(person){
        response.json(person);
    }else{
        response.status(404).end();
    }
})


app.put('/api/persons/:id', (request, response) => {
    console.log(request.body);
  });
  
  
  

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id != id);
    response.json(persons);
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        })
    } 

    if(persons.some(person => person.name === body.name )){
        return response.status(400).json({
            error:"name must be unique"
        })
    }

    const person = {
        id : generateId(),
        name: body.name,
        number:body.number
    }

    persons = persons.concat(person);

    response.json(person);

})




const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});


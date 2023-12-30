import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import Contact from './models/phonebook.js';

//A logger function that will be passed to app.use() to add it as a middleware for the incoming request and outcomiing response.
const requestLogger = (request, response, next) => {
    console.log('Method: ',request.method);
    console.log('Path: ', request.path);
    console.log('BodyL ', request.body);
    console.log('-----')
    next();
};

//An endpoint that will be passed to app.use() to handle 
const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'Unknown URL path' });
};

app.use(express.json());
app.use(requestLogger);
app.use(express.static('build'));


//Fetch all the data inside the database
app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(result => {
        response.json(result);
    })
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id;

    Contact.FindByIdAndRemove(id).then(() => {
        response.status(204).end();
    }).catch(error => {
        console.error(`Unable to delete: `, error.message);
        response.status(500).json({ error: 'Internal server error' });
    })
})

app.post('/api/contacts', (request, response) => {
    const body = request.body;
    if (body === undefined) return response.status(400).send({ error: 'Content missing' });

    const contact = new Contact({
        name: request.name,
        number: request.number,
        address: request.address || 'N/A',
        age: request.age,
    })
    contact.save().then(res => {
        console.log(res)
    }).catch(error => {
        console.error(`Unable to save: `, error.message)
    })
})

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


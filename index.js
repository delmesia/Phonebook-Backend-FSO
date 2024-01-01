import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';

import Contact from './models/phonebook.js';

app.use(cors({ origin: 'http://localhost:5173' }));

//A logger function that will be passed to app.use() to add it as a middleware for the incoming request and outcomiing response.
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method);
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
    });
});

app.get('api/contacts/:name', (request, response) => {
    const contactName = request.params.name
    Contact.find({ name: `${contactName}` }).then(result => {
        response.json(result);
    }).catch(error => {
        console.error(error)
        response.status(404).json({ error: 'Internal server error' })
    })
})

app.get('/api/contacts/:id', (request, response) => {
    const contactId = request.params.id;
    Contact.find({ id: `${contactId}` }).then(result => {
        response.json(result);
    })
})

app.put('/api/contacts/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body

    try {
        // Find the resource by ID and update it
        const updatedResource = await Contact.findByIdAndUpdate(id, body, {
            new: true, // Return the updated document
        });

        if (updatedResource) {
            res.status(200).json({ message: 'Resource updated successfully', data: updatedResource });
        } else {
            res.status(404).json({ error: 'Resource not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/contacts/:id', async (request, response) => {
    const id = request.params.id;

    // Check if id is not provided or not a valid ObjectId
    if (!id || !mongoose.isValidObjectId(id)) {
        return response.status(400).json({ error: 'Invalid contact ID' });
    }

    try {
        const deletedContact = await Contact.findOneAndDelete({ _id: id });
        if (!deletedContact) {
            // If the contact with the specified ID is not found
            return response.status(404).json({ error: 'Contact not found' });
        }
        response.status(204).end(); // No content on successful deletion
    } catch (error) {
        console.error(`Unable to delete: `, error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/contacts', (request, response) => {
    const body = request.body;
    if (!body) return response.status(400).json({ error: 'Content missing' });
    const contact = new Contact({
        name: body.name,
        number: body.number,
        address: body.address || 'N/A',
        age: body.age,
    });

    contact.save().then(savedContact => {
        console.log(savedContact);
        response.json(savedContact);
    }).catch(error => {
        console.error('Unable to save:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


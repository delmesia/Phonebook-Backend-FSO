import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Contact from './models/phonebook.js';

const app = express();
dotenv.config();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.static('build'));

// Logger middleware for logging request details
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('-----');
    next();
};

// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'Unknown URL path' });
};

app.use(requestLogger);

// Fetch all contacts
app.get('/api/contacts', async (request, response) => {
    try {
        const result = await Contact.find({});
        response.json(result);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

// Search contacts by name (case-insensitive)
app.get('/api/contacts/:name', (request, response) => {
    try {
        const contactName = decodeURIComponent(request.params.name);
        const contactRegex = new RegExp(contactName, 'i');

        Contact.find({ name: contactRegex }).then(result => {
            response.json(result);
        }).catch(error => {
            console.error(error);
            response.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error(error);
        response.status(400).json({ error: 'Invalid URL parameter' });
    }
});


// Get contact by ID
app.get('/api/contacts/id/:id', async (request, response) => {
    try {
        const contactId = request.params.id;
        const result = await Contact.findById(contactId);
        response.json(result);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

// Update contact by ID
app.put('/api/contacts/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
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

// Delete contact by ID
app.delete('/api/contacts/:id', async (request, response) => {
    const id = request.params.id;

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return response.status(404).json({ error: 'Contact not found' });
        }
        response.status(204).end();
    } catch (error) {
        console.error(`Unable to delete: `, error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new contact
app.post('/api/contacts', async (request, response) => {
    const body = request.body;

    if (!body) {
        return response.status(400).json({ error: 'Content missing' });
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
        address: body.address || 'N/A',
        age: body.age,
    });

    try {
        const savedContact = await contact.save();
        console.log(savedContact);
        response.json(savedContact);
    } catch (error) {
        console.error('Unable to save:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

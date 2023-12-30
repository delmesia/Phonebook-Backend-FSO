const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const Note = require('./models/note'); // Import the Note model

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static('build'));

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.post(`/api/notes`, (request, response) => {
  const body = request.body;
  if (body.content === undefined) return response.status(400).json({ error: 'content missing' })
  const note = new Note({
    content: request.content,
    important: body.important || false,
  })
  note.save().then(savedNote => {
    response.json(savedNote);
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note);
  });
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;

  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.log('Error deleting note:', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

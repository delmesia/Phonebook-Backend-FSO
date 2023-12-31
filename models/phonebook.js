import mongoose from "mongoose";

mongoose.set(`strictQuery`, true);

const uri = process.env.MONGODB_URI; //The url will be set to whatever is in the .env (Database link)

console.log(`Attempting to connecto to`, uri);

//Open the connection to MongoDB, log an error if unsuccessfull.
mongoose.connect(uri)
    .then(result => {
        console.log(`You are now connected to MongoDB`)
    })
    .catch((error) => {
        console.error(`Error connecting to MongoDB: `, error.message);
    });

//Create a schema, a blueprint of how the object is structured.
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    address: String,
    age: String
})
//Converting the retured value of the document to string properly.
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});



//Export the model
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;

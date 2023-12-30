/*const mongoose = require('mongoose');

const argvLen = process.argv.length;

if (argvLen < 3) {
    console.log('Give password as an argument');
    process.exit(1);
}

const password = process.argv[2];
const _name = process.argv[3];
const _number = process.argv[4];

const url = `mongodb+srv://wendellsmesia:${password}@cluster0.nibu6b7.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: String,
});

const Contact = mongoose.model('Contact', contactSchema);

const contact = new Contact({
    name: _name,
    number: _number,
    date: new Date().toISOString(), // Fix: use ISO format for date
});

if (argvLen === 3) {
    console.log('Phonebook');
    Contact.find({})
        .then((result) => {
            result.forEach((c) => {
                console.log(`name: ${c.name}\nnumber: ${c.number}\ndate: ${c.date}\n===========`);
            });
        })
        .catch((error) => {
            console.error('Error fetching contacts: ', error);
        })
        .finally(() => {
            mongoose.connection.close();
        });
} else if (argvLen > 3 && argvLen <= 5) {
    contact.save()
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error('Error saving contact: ', error);
        })
        .finally(() => {
            mongoose.connection.close();
        });
} else {
    console.error('Invalid number of arguments.');
    mongoose.connection.close();
}
*/
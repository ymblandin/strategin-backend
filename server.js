require('dotenv').config();

const app = require('./src/app');

const port = parseInt(process.env.PORT ?? 5000, 10);

app.listen(port, (err) => {
  if (err) {
    console.error('Something bad happened:', err);
  } else {
    console.warn(`Server is lsitening on ${port}`);
  }
});

const dbURI =
  'mongodb+srv://test:<password>@strategin.zinbwga.mongodb.net/?retryWrites=true&w=majority';

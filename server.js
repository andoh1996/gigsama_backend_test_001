/* eslint-disable prettier/prettier */
const dotenv = require('dotenv');

const app = require('./index.js');

dotenv.config({ path: './config.env' });



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

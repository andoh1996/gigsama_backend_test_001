const express = require('express');
const morgan = require('morgan');
const { unless } = require('express-unless');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');

const auth = require('./src/middlewares/auth.middleware');
const error = require('./src/middlewares/error.middleware');




const app = express();
dotenv.config({ path: './config.env' });


// Use the CORS middleware globally
app.use(cors({
  origin: '*', // You can replace '*'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,  
}));

app.options('*', cors()); // Preflight requests for all routes


// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//////////////////////swagger api documentation middleware////////////////////
// Load Swagger documentation files from the docs folder
const docsFolderPath = path.join(__dirname, 'docs');
const docFiles = fs.readdirSync(docsFolderPath).map(file => path.join(docsFolderPath, file));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Telical Business Api',
      version: '1.0.0',
      description: "This docs contain all the information needed about every api used in telical business endpoints",
      contact: {
        name: 'Ben Andoh',
        email: 'benandoh1996@gmail.com'
      }
    },
    servers: [
      {
        url: 'https://telical-business.onrender.com/',
        description: 'Live Server'
      },

      {
        url: 'http://localhost:4000',
        description: 'Localhost'
      }
    ],
  },
  apis: docFiles, 
};

const specs = swaggerjsdoc(options);
app.use('/api/docs/', swaggerui.serve, swaggerui.setup(specs));


// This line is setting a property `unless` on the `authenticateToken` function, allowing the use of the `unless` middleware.
auth.authenticateToken.unless = unless;

// This line is adding the `auth.authenticateToken` middleware to the Express application.
// The middleware is configured with the `unless` function, which will skip authentication for specific paths and HTTP methods.
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: '/', methods: ['GET'] },
      { url: '/auth/register/users', methods: ['POST'] },
      { url: '/auth/register/doctors', methods: ['POST'] },
      { url: '/auth/login/users', methods: ['POST'] },
      { url: '/auth/login/doctors', methods: ['POST'] },
    ],
  }),
);

// Sanitize user input data before reaching other middlewares
app.use(mongoSanitize());

app.use(express.json());


// Set the default promise implementation to the global Promise constructor
mongoose.Promise = global.Promise;

///////////////connecting to mongodb//////////
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connection Success');
    
    require('./src/cronjob/getReminder.cron')

});

//  ROUTES
app.use('/', require('./src/routes/index.route'));
app.use('/auth', require('./src/routes/auth.route'));
app.use('/medical-note', require('./src/routes/medicalNote.route'));


/////Express Error Handler
app.use(error.errorHandler);


module.exports = app;

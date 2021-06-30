const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');

const { logErrors, wrapErrors, errorHandler } = require('./utils/middlewares/errorHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

const notFoundHandler = require('./utils/middlewares/notFoundHandler');

app.use(express.json());

moviesApi(app);
userMoviesApi(app);

// Catch 404
app.use(notFoundHandler)

// Errors handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Listening http://localhost:${config.port}`)
});
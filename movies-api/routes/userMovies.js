const express = require('express');
const passport = require('passport');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

require('../utils/auth/strategies/jwt');

function userMoviesApi(app) {
    const router = express.Router();
    app.use('/api/user-movies', router);

    const userMoviesService = new UserMoviesService();

    router.get('/', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['read:user-movies']),
        validationHandler({ id: userIdSchema }), 'query', 
        async(req, res, next) => {
            const { id } = req.query;

            try{
                const userMovies = await userMoviesService.getUserMovies({ id });

                res.status(200).json({
                    data: userMovies,
                    message: 'user movies listed'
                })

            } catch(err) {
                next(err)
            }
        });

    router.post('/', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['create:user-movies']),
        validationHandler(createUserMovieSchema), 
        async(req, res, next) => {
            const { body: userMovie } = req;

            try {
                const createdUserMovieId = await userMoviesService.createUserMovie({
                    userMovie
                });

                res.status(201).json({
                    data: createdUserMovieId,
                    message: 'user movie created'
                });

            } catch(err) {
                next(err);
            }
        });

    router.delete('/:movieId', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['delete:user-movies']),
        validationHandler({ movieId: movieIdSchema }), 'params', 
        async(req, res, next) => {
            const { movieId } = req.params;

            try {
                const deletedUserMovieId = await userMoviesService.deleteUserMovie({
                    movieId
                });

                res.status(200).json({
                    data: deletedUserMovieId,
                    message: 'user movie deleted'
                });

            } catch(err) {
                next(err);
            }
        });
};

module.exports = userMoviesApi;
const express = require('express');
const MoviesService = require('../services/movies');
const passport = require('passport');

const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middlewares/validationHandler');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const { 
    FIVE_MINUTES_IN_SECONDS, 
    SIXTY_MINUTES_IN_SECONDS 
    } = require('../utils/time');

require('../utils/auth/strategies/jwt');

function moviesApi(app) {
    const router = express.Router();
    app.use('/api/movies', router);

    const moviesService = new MoviesService();

    router.get('/', 
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:movies']), 
        async(req, res, next) => {
            cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
            const { tags } = req.query;

            try {
                const movies = await moviesService.getMovies({ tags });

                res.status(200).json({
                    data: movies,
                    message: 'movies listed'
                });

            } catch(err) {
                next(err)
            }
        });

    router.get('/:id', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['read:movies']),
        validationHandler({ id: movieIdSchema }, 'params'),
        async(req, res, next) => {
            cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
            const { id } = req.params;

            try {
                const movie = await moviesService.getMovie({ id });

                res.status(200).json({
                    data: movie,
                    message: 'movie listed'
                });

            } catch(err) {
                next(err)
            }
        });

    router.post('/', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['create:movies']),
        validationHandler(createMovieSchema), 
        async(req, res, next) => {
            const { body: movie } = req;
            try {
                const createMovieId = await moviesService.createMovie({ movie });

                res.status(201).json({
                    data: createMovieId,
                    message: 'movie created'
                });

            } catch(err) {
                next(err)
            }
        });

    router.put('/:id', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['update:movies']),
        validationHandler({ id: movieIdSchema }, 'params'), 
        validationHandler(updateMovieSchema), 
        async(req, res, next) => {
            const { id } = req.params;
            const { body: movie } = req;
            
            try {
                const updatedMovieId = await moviesService.updateMovie({ id, movie });

                res.status(200).json({
                    data: updatedMovieId,
                    message: 'movie updated'
                });

            } catch(err) {
                next(err)
            }
        });

    router.delete('/:id', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['delete:movies']),
        validationHandler({ id: movieIdSchema }, 'params'), 
        async(req, res, next) => {
            const { id } = req.params;

            try {
                const deletedMovieId = await moviesService.deleteMovie({ id });

                res.status(200).json({
                    data: deletedMovieId,
                    message: 'movie deleted'
                });

            } catch(err) {
                next(err)
            }
        });
}

module.exports = moviesApi;
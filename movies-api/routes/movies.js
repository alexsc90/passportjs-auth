const express = require('express');
const MoviesService = require('../services/movies');

const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middlewares/validationHandler');

const cacheResponse = require('../utils/cacheResponse');
const { 
    FIVE_MINUTES_IN_SECONDS, 
    SIXTY_MINUTES_IN_SECONDS 
    } = require('../utils/time');


function moviesApi(app) {
    const router = express.Router();
    app.use('/api/movies', router);

    const moviesService = new MoviesService();

    router.get('/', async(req, res, next) => {
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

    router.get('/:id', validationHandler({ id: movieIdSchema }, 'params'), async(req, res, next) => {
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

    router.post('/', validationHandler(createMovieSchema), async(req, res, next) => {
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

    router.put('/:id', validationHandler({ id: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async(req, res, next) => {
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

    router.delete('/:id', validationHandler({ id: movieIdSchema }, 'params'), async(req, res, next) => {
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
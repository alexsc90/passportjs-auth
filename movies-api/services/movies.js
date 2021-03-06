const MongoLib = require('../lib/mongo')

class MoviesService {
    constructor() {
        this.collection = 'movies';
        this.mongoDB = new MongoLib();
    }

    async getMovies({ tags }) {
        const query = tags && { tags: { $in: tags } };
        const movies = await this.mongoDB.getAll(this.collection, query);
        return movies || [];
    }

    async getMovie({ id }) {
        const movie = await this.mongoDB.get(this.collection, id);
        return movie || {};
    }

    async createMovie({ movie }) {
        const createMovieId = await this.mongoDB.create(this.collection, movie);
        return createMovieId;
    }

    async updateMovie({ id, movie } = {}) {
        const updateMovieId = await this.mongoDB.update(this.collection, id, movie);
        return updateMovieId;
    }

    async deleteMovie({ id }) {
        const deleteMovieId = await this.mongoDB.delete(id);
        return deleteMovieId;
    }
}

module.exports = MoviesService
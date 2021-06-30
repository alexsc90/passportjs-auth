const MongoLib = require('../lib/mongo');

class UserMoviesService {
    constructor() {
        this.collection = 'user-movies';
        this.mongoDB = new MongoLib();
    }

    async getUserMovies({ id }) {
        const query = id && { id };
        const userMovies = await this.mongoDB.getAll(this.collection, query);

        return userMovies || [];
    }

    async createUserMovie({ userMovie }) {
        const createdUserMovieId = await this.mongoDB.create(this.collection, userMovie);

        return createdUserMovieId;
    }

    async deleteUserMovie({ movieId }) {
        const deletedUserMovieId = await this.mongoDB.delete(this.collection, movieId);

        return deletedUserMovieId;
    }
}

module.exports = UserMoviesService;
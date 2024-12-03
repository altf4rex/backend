// a model for working with films

import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    director: String,
})

export default mongoose.model('Movies', movieSchema, 'movies')
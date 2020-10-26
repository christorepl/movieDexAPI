require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
const PORT = 8000
const MOVIES = require('./movies-data-small.json')

app.use(function validateBearerToken(req, res, next) {
    console.log('validation ran')
    const token = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (token.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
})

app.get('/movie', handleGetMovies)

function handleGetMovies (req, res) {
    let response = MOVIES
    const { genre, country, avg_vote } = req.query
    if (genre) {
        response = response.filter(movies => movies.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if (country) {
        response = response.filter(movies => movies.country.toLowerCase().includes(country.toLowerCase()))
    }
    if(avg_vote) {
        response = response.filter(movies => Number(movies.avg_vote) >= Number(avg_vote))
    }
    res.status(200).json(response)
}

app.listen(PORT, () => {
    console.log('movieDex API listening on 8000')
})
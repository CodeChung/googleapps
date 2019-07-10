const express = require('express');
const morgan = require('morgan');
const apps = require('./playstore');
const cors = require('cors');

const app = express();

app.use(morgan('common')).use(cors());

app.get('/apps', (req, res) => {
    const { sort='', genres='', search='' } = req.query;
    const genreChoice = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card', '']
    console.log(sort, 'sort is')
    if (sort && sort !== 'Rating' && sort !== 'App') {
        return res
            .status(400)
            .send('sort must be by app or rating')
    }
    if (!genreChoice.includes(genres.toLowerCase())) {
        return res
            .status(400)
            .send('genre must be included in choices')
    }
    
    let results = apps
        .filter(app => 
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase()))
        .filter(app => {
            if (genres) {
                return app
                    .Genres
                    .toLowerCase()
                    .includes(genres.toLowerCase())
            }
            return true
        })
        .sort((a, b) => {
            if (sort === 'App') {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
            } else {
                return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0
            }
        })
    res.send(results)
})

app.listen(8000, () => {
    console.log('Server started on PORT 8000')
})
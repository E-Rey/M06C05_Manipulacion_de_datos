const { response } = require('express');
const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: ['name']
        })
            .then(genres => res.render('moviesAdd', {
                genres
            }))
            .catch(error => console.log(error)) // TODO   
    },
    create: function (req, res) {

        const { title, release_date, rating, awars, genre_id, length } = req.body;
        db.Movie.create({
            ...req.body,
            title: title.trim(),
        })
            .then(movie => {
                console.log(movie)
                return res.redirect('/movies/detail/' + movie.id)
            })
            .catch(error => console.log(error))
    },
    edit: function (req, res) {
        let genre = db.Genre.findAll({
            order: ['name']
        })
        let movie = db.Movie.findByPk(req.params.id);
        Promise.all([genres, movies])
            .then(([genres, movie]) => {
                res.render("moviesEdit", {
                    genres,
                    Movie: movie,
                })
            })
            .catch(error => console.log(error)) // TODO   
    },
    update: function (req, res) {

        db.Movie.update(
            {
                ...req.body,
                title: req.body.title.trim()
            },
            {
                where: { id: req.params.id }
            }
        )
            .then(response => {
                console.log(response);
                return res.redirect('movies/detail/' + req.params.id)
            })
            .catch(error => console.log(error))


        // TODO
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie => res.render('moviesDelete',{
            Movie : movie
        }))
        .catch(error => console.log(error))

        // TODO
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(() => res.redirect('/movies'))
        .catch(error => console.log(error))
        // TODO
    }

}

module.exports = moviesController;
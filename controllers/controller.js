const { User, Post, Profile } = require('../models')
const { hashingPassword, comparingPassword } = require('../helpers')
const { Op } = require('sequelize')

class Controller {
    static home(req, res) {
        let { error } = req.query
        let errors = ''
        if (error) {
            errors = error.split(',')
        }
        res.render('home', { errors })
    }

    static landingPage(req, res) {
        let { userId, userRole } = req.session
        let { searchByUser, searchByContent, error } = req.query
        let errors = ''
        if (error) {
            errors = error.split(',')
        }
        let dataPost = {}
        let dataUser = {}
        Post.findAllPosts(searchByUser, searchByContent, User, Profile)
            .then(data => {
                dataPost = data
                return User.findLoggedUser(userId, Profile)
            })
            .then(data => {
                dataUser = data
                if (userRole === 'admin') {
                    return User.findAll({ where: { role: 'user' } })
                } else {
                    return null
                }
            })
            .then(dataAllUser => {
                res.render('landingPage', { dataPost, dataUser, dataAllUser, errors })
            })
            .catch(err => res.send(err))
    }

    static register(req, res) {
        let { email, password } = req.body
        User.create({ email, password })
            .then(data => {
                return Profile.newProfile(data.id)
            })
            .then(data => {
                res.redirect('/')
            })
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    let errors = err.errors.map(el => el.message)
                    res.redirect(`/?error=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static login(req, res) {
        let { email, password } = req.body
        User.findOne({ where: { email } })
            .then(data => {
                if (data) {
                    let isValidPassword = comparingPassword(password, data.password)
                    if (isValidPassword) {
                        req.session.userId = data.id
                        req.session.userRole = data.role
                        res.redirect('/home')
                    } else {
                        res.redirect('/?error=Invalid Email or Password')
                    }
                } else {
                    res.redirect('/?error=Invalid Email or Password')
                }
            })
            .catch(err => res.send(err))
    }

    static logout(req, res) {
        if (req.session.userId && req.session.userRole) {
            delete req.session.userId
            delete req.session.userRole
        }
        res.redirect('/')
    }

    static addPost(req, res) {
        let { userId } = req.session
        let { content } = req.body
        let imageURL = req.file.path
        Post.create({ content, imageURL, UserId: userId, vote: 0 })
            .then(data => res.redirect('/home'))
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    let errors = err.errors.map(el => el.message)
                    res.redirect(`/home?error=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static upVote(req, res) {
        let { PostId } = req.params
        Post.increment('vote', { by: 1, where: { id: PostId } })
            .then(data => res.redirect('/home'))
            .catch(err => res.send(err))
    }
    static downVote(req, res) {
        let { PostId } = req.params
        Post.decrement('vote', { by: 1, where: { id: PostId } })
            .then(data => res.redirect('/home'))
            .catch(err => res.send(err))
    }

    static deletePost(req, res) {
        let { userId } = req.session
        let { PostId } = req.params
        Post.findOne({ where: { id: PostId } })
            .then(data => {
                if (userId !== data.UserId) {
                    return res.redirect(`/home?error=Cannot delete other person post`)
                } else {
                    return Post.destroy({ where: { id: PostId } })
                }
            })
            .then(data => res.redirect('/home'))
            .catch(err => res.send(err))
    }
}

module.exports = Controller
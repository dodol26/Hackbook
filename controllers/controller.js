const { User, Post, Profile } = require('../models')
const { hashingPassword, comparingPassword } = require('../helpers')
const { Op } = require('sequelize')

class Controller {
    static home(req, res) {
        res.render('home')
    }

    static landingPage(req, res) {
        let { userId } = req.session
        let { searchByUser, searchByContent } = req.query
        let dataPost = {}

        Post.findAllPosts(searchByUser, searchByContent, User, Profile)
            .then(data => {
                dataPost = data
                return User.findLoggedUser(userId, Profile)
            })
            .then(dataUser => {
                res.render('landingPage', { dataPost, dataUser })
            })
            .catch(err => res.send(err))
    }

    static register(req, res) {
        let { email, password } = req.body
        User.create({ email, password })
            .then(data => res.redirect('/'))
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
        delete req.session.userId
        delete req.session.userRole
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

    static editForm(req, res) {
        let { userId } = req.session
        let { PostId } = req.params
        Post.findOne({ where: { id: PostId } })
            .then(data => {
                if (userId !== data.UserId) {
                    res.redirect(`/home?error=Cannot edit other person post`)
                } else {
                    res.render('editPost', { data })
                }
            })
            .catch(err => res.send(err))
    }
    static editPost(req, res) {
        let { userId } = req.session
        let { PostId } = req.params

        Post.update({

        },
            { where: { id: PostId } })
    }
}

module.exports = Controller
const { User, Post, Profile } = require('../models')
const { comparingPassword } = require('../helpers')

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
        let { searchByContent, error } = req.query
        let errors = ''
        if (error) {
            errors = error.split(',')
        }
        let dataPost = {}
        let dataUser = {}
        Post.findAllPosts(searchByContent, User, Profile)
            .then(data => {
                dataPost = data
                return User.findLoggedUser(userId, Profile)
            })
            .then(data => {
                dataUser = data
                if (userRole == 'admin') {
                    return User.findAll({ where: { role: 'user' }, include: Profile })

                } else {
                    return null
                }
            })
            .then(dataAllUser => {
                return res.render('landingPage', { dataPost, dataUser, dataAllUser, errors })
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
                return res.redirect('/')
            })
            .catch(err => {
                if (err.name == 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError') {
                    let errors = err.errors.map(el => el.message)
                    return res.redirect(`/?error=${errors}`)
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
                        return res.redirect('/home')
                    } else {
                        return res.redirect('/?error=Invalid Email or Password')
                    }
                } else {
                    return res.redirect('/?error=Invalid Email or Password')
                }
            })
            .catch(err => res.send(err))
    }

    static logout(req, res) {
        if (req.session.userId && req.session.userRole) {
            delete req.session.userId
            delete req.session.userRole
        }
        return res.redirect('/')
    }

    static addPost(req, res) {
        let imageURL = '#'
        if (req.file) {
            if (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg') {
                imageURL = req.file.path
            } else {
                return res.redirect('/home?error=Only .png, .jpg and .jpeg format allowed!')
            }
        }
        let { userId } = req.session
        let { content } = req.body
        Post.create({ content, imageURL, UserId: userId, vote: 0 })
            .then(data => res.redirect('/home'))
            .catch(err => {
                if (err.name == 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError') {
                    let errors = err.errors.map(el => el.message)
                    return res.redirect(`/home?error=${errors}`)
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
        let { userId, userRole } = req.session
        let { PostId } = req.params
        Post.findOne({ where: { id: PostId } })
            .then(data => {
                if (userId == data.UserId || userRole == 'admin') {
                    return Post.destroy({ where: { id: PostId } })
                } else {
                    return res.redirect(`/home?error=Cannot delete other person post`)
                }
            })
            .then(data => res.redirect('/home'))
            .catch(err => res.send(err))
    }

    static editProfileForm(req, res) {
        let { userId } = req.session
        let { UserId } = req.params
        let { error } = req.query
        Profile.findOne({ where: { id: UserId } })
            .then(data => {
                if (data.UserId != userId) {
                    return res.redirect(`/home?error=Cannot edit other person profile`)
                } else {
                    return res.render('editForm', { data, error })
                }
            })
            .catch(err => res.send(err))
    }
    static editProfile(req, res) {
        let profilePicture = '#'
        let { userId } = req.session
        let { UserId } = req.params
        if (req.file) {
            if (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg') {
                profilePicture = req.file.path
            } else {
                return res.redirect(`/profile/edit/${UserId}?error=Only .png, .jpg and .jpeg format allowed!`)
            }
        }
        let { name, dateOfBirth, aboutMe, gender } = req.body
        Profile.findOne({ where: { id: UserId } })
            .then(data => {
                if (data.UserId != userId) {
                    return res.redirect(`/home?error=Cannot edit other person profile`)
                } else {
                    return Profile.update({ name, dateOfBirth, aboutMe, gender, profilePicture },
                        { where: { id: UserId } })
                }
            })
            .then(data => res.redirect('/home'))
            .catch(err => {
                if (err.name == 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError') {
                    let errors = err.errors.map(el => el.message)
                    return res.redirect(`/profile/edit/${UserId}?error=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static deleteUser(req, res) {
        let { userId, userRole } = req.session
        let { UserId } = req.params
        if (userRole != 'admin') {
            return res.redirect('/home')
        } else {
            User.findOne({ where: { id: UserId } })
                .then(data => {
                    if (data.role == 'admin') {
                        return res.redirect('/home?error=Cannot delete other admin')
                    } else {
                        return User.destroy({ where: { id: UserId } })
                    }
                })
                .then(data => res.redirect('/home'))
                .catch(err => res.send(err))
        }
    }
    static profilePage(req, res) {
        let { userId } = req.session
        let { UserId } = req.params
        User.findOne({ where: { id: userId }, include: [Profile] })
            .then(data => {
                console.log(data.Profile.profilePicture, "<<", "UserId", UserId)
                if (data.Profile.id == UserId) {
                    return res.render('profilePage', { data })
                } else {
                    return res.redirect('/home?error=Cannot view other person profile')
                }
            })
            .catch(err => res.send(err))
    }
}

module.exports = Controller
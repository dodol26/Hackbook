const {User, Post, Profile} = require('../models')
var bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

class Controller{
    static home(req, res){
        res.render('home')
    }

    static landingPage(req, res){
        let {userId} = req.session
        let {searchByUser, searchByContent} = req.query
        let option = {include: {
            model: User
        }}
        let dataPost = {}

        if(searchByUser){
            option.include.include = {
                model: Profile,
                where: {
                    name: {
                        [Op.iLike]: searchByUser
                    }
                }
            }
        }

        if(searchByContent){
            option.where = {
                content: {
                    [Op.iLike]: searchByContent
                }
            }
        }

        Post.findAll(option)
            .then(data => {
                dataPost = data
                return User.findOne({where: {id: userId}})
            })
            .then(dataUser => {
                res.render('landingPage', {dataPost, dataUser})
            })
            .catch(err => res.send(err))
    }

    static register(req, res){
        let {email, password} = req.body
        User.create({email, password})
            .then(data => res.redirect('/'))
            .catch(err => {
                if(err.name === 'SequelizeUniqueConstraintError'){
                    let errors = err.errors.map(el => el.message)
                    res.redirect(`/?error=${errors}`)
                }else{
                    res.send(err)
                }
            })
    }

    static login(req, res){
        let {email, password} = req.body
        User.findOne({where: {email}})
            .then(data => {
                if(data){
                    let isValidPassword = bcrypt.compareSync(password, data.password)
                    if(isValidPassword){
                        req.session.userId = data.id
                        req.session.userRole = data.role
                        res.redirect('/home')
                    }else{
                        res.redirect('/?error=Invalid Email or Password')
                    }
                }else{
                    res.redirect('/?error=Invalid Email or Password')
                }
            })
            .catch(err => res.send(err))
    }

    static logout(req, res){
        delete req.session.userId
        delete req.session.userRole
        res.redirect('/')
    }

    static addPost(req, res){
        let {title, content, imageURL} = req.body
    }
}

module.exports = Controller
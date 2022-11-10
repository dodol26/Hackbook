const {User, Post} = require('../models')

class Controller{
    static home(req, res){
        Post.findAll()
            .then(data => res.render('test', {data}))
            .catch(err => res.send(err))
    }

    static addPost(req, res){
        let {title, content, imageURL} = req.body
    }

    static registerForm(req, res){
        res.render('register')
    }
    static register(req, res){
        let {email, password} = req.body
        User.create({email, password})
            .then(data => res.redirect('/'))
            .catch(err => res.send(err))
    }

    static loginForm(req, res){
        res.render('login')
    }
    static login(req, res){
        let {email, password} = req.body
        User.findOne({where: {
            email, password
        }})
            .then(data => {
                if(data){
                    res.send('login berhasil')
                }else{
                    res.redirect('/login?error=user not found')
                }
            })
            .catch(err => res.send(err))
    }
}

module.exports = Controller
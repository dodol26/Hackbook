const {User, Post} = require('../models')
var bcrypt = require('bcryptjs')

class Controller{
    static home(req, res){
        Post.findAll()
            .then(data => res.render('home', {data}))
            .catch(err => res.send(err))
    }

    static addPost(req, res){
        let {title, content, imageURL} = req.body
    }

    static register(req, res){
        let {email, password} = req.body
        User.create({email, password})
            .then(data => res.redirect('/'))
            .catch(err => res.send(err))
    }

    static login(req, res){
        let {email, password} = req.body
        User.findOne({where: {email}})
            .then(data => {
                if(data){
                    let isValidPassword = bcrypt.compareSync(password, data.password)
                    if(isValidPassword){
                        req.session.userId = data.id
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
}

module.exports = Controller
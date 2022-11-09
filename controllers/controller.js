class Controller{
    static home(req, res){
        res.render('home')
    }

    static registerForm(req, res){
        res.render('register')
    }
    static register(req, res){
        console.log(req.body)
    }
}

module.exports = Controller
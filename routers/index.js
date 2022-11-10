const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.home)

// router.post('/register', Controller.register)

// router.post('/login', Controller.login)

router.use((req, res, next) => {
    if(req.session.userId){
        // console.log('Time:', Date.now())
        next()
    }else{
        res.redirect('/?error=Please Login first')
    }
})

// router.post('/', Controller.addPost)

module.exports = router
const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.home)
// router.post('/', Controller.addPost)

// router.get('/register', Controller.registerForm)
// router.post('/register', Controller.register)

// router.get('/login', Controller.loginForm)
// router.post('/login', Controller.login)

module.exports = router
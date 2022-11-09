const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.home)

router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

module.exports = router
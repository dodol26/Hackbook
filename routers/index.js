const router = require('express').Router()
const Controller = require('../controllers/controller')
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
const upload = multer({ storage })

router.get('/', Controller.home)

router.post('/register', Controller.register)

router.post('/login', Controller.login)

router.get('/logout', Controller.logout)

router.use((req, res, next) => {
    if (req.session.userId) {
        // console.log('Time:', Date.now())
        next()
    } else {
        res.redirect('/?error=Please Login first')
    }
})

router.get('/home', Controller.landingPage)

router.post('/home/addPost', upload.single('imageURL'), Controller.addPost)

module.exports = router
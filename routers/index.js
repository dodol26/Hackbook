const router = require('express').Router()
const Controller = require('../controllers/controller')
const multer = require("multer")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})

var upload = multer({
    storage,
    // fileFilter: function (req, file, cb) {
    //     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    //         cb(null, true)
    //     } else {
    //         cb(null, false)
    //         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //     }
    // },
    limits: { fileSize: 1024 * 1024 * 5 },
})

router.get('/', Controller.home)
router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.get('/logout', Controller.logout)

router.use((req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.redirect('/?error=Please Login first')
    }
})

router.get('/home', Controller.landingPage)

router.post('/home/addPost', upload.single('imageURL'), Controller.addPost)

router.get('/home/upVote/:PostId', Controller.upVote)
router.get('/home/downVote/:PostId', Controller.downVote)

router.get('/home/delete/:PostId', Controller.deletePost)
router.get('/profile/:UserId', Controller.profilePage)
router.get('/profile/edit/:UserId', Controller.editProfileForm)
router.post('/profile/edit/:UserId', upload.single('profilePicture'), Controller.editProfile)

router.use((req, res, next) => {
    if (req.session.userRole == 'admin') {
        next()
    } else {
        res.redirect('/home')
    }
})

router.get('/user/delete/:UserId', Controller.deleteUser)

module.exports = router
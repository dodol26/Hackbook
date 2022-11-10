var bcrypt = require('bcryptjs')

function hashingPassword(password){
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)
    return hash
}

function comparingPassword(rawPassword, hashPassword){
    return bcrypt.compareSync(rawPassword, hashPassword)
}

module.exports = {hashingPassword, comparingPassword}
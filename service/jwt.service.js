const jwt = require('jsonwebtoken')
const key =require('../keys/index')

/**
 * создание jwt токена
 * @name generateToken
 * @param user объект пользователя {name,email,_id}
*/

function generateToken(user) {
    try {
        let u = {
            name: user.name,
            email: user.email,
            _id: user._id
        }
        console.log(u)
        return token = jwt.sign(u, key.JWT_SECRET,{
            expiresIn: 60*60*24
        })
    } catch (error) {
        console.log(error)
    }
   
}

module.exports = generateToken
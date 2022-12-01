const bcrypt = require("bcryptjs")
const User = require("../entity/users.model")
const generateToken = require("../service/jwt.service")

/**
 * Объект с методами сущности User
 * @name userService
 */

const userService = {
  /**
   * Метод создает новго пользователя
   * @param {object} registerData Объект параметров нового пользователя
   * @param {string} registerData.name
   * @param {string} registerData.email
   * @param {string} registerData.password
   * @returns {Object} {code,{newUser,jwt}}
   */

  async create(registerData) {
    try {
      const { name, email, pass } = registerData
      const candidate = await User.findOne({ email })
      if (candidate) {
        return {
          code: 400,
          message: `a user with this  ${email} already exists`,
        }
      } else {
        const hashPassword = await bcrypt.hash(pass, 10)
        const user = new User({ name, email, password: hashPassword })

        let createdUser = await user.save()
        const { password, ...otherParams } = createdUser._doc

        const token = generateToken(createdUser)
        return {
          code: 200,
          payload: { ...otherParams, token },
        }
      }
    } catch (error) {
      console.log(error)
    }
  },

/**
 * 
 * @param {Object} loginaData Объект с параметрами для аутентификации пользователя 
 * @param {string} registerData.email
 * @param {string} registerData.password
 * @returns {jwt}  jwt
 */

  async login(loginaData) {
    try {
      const { email, password } = loginaData
      const candidate = await User.findOne({ email })
      if (!candidate) {
        return {
          code: 404,
          message: "Wrong password or email",
        }
      }
      await bcrypt.compare(password, candidate.password, function (err, valid) {
        if (!valid) {
          return {
            code: 404,
            message: "Wrong password or email",
          }
        }
      })
      const token = await generateToken(candidate)
      return { code: 200, token }
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = userService

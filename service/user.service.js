const bcrypt = require("bcryptjs")
const User = require("../entity/users.model")
const generateToken = require("../service/jwt.service")

const userService = {
  async create(registerData) {
    const { name, email, password } = registerData
    const candidate = await User.findOne({ email })
    if (candidate) {
      return {
        code: 400,
        message: `a user with this  ${email} already exists`,
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({ name, email, password: hashPassword })

      const createdUser = await user.save()

      const token = generateToken(createdUser)
      return {
        code: 200,
        token,
      }
    }
  },

  async login(loginaData) {
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
    console.log("token")
    const token = await generateToken(candidate)
    return { code: 200, token }
  },
}

module.exports = userService

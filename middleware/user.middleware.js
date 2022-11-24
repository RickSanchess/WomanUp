const User = require("../entity/users.model")

module.exports = async function (req, res, next) {
  try {
    if (!req.userId) {
      return next()
    }
    req.user = await User.findById(req.userId)
    next()
  } catch (error) { 
    console.log(error)
  }
}

const key = require("../keys/index")
const jwt = require("jsonwebtoken")


/**
 * Функция промежуточной обработки
 * проверяет валидность токена
 * @func
 * @name auth
 * @param req объект запроса
 * @param res объект ответа
 * @param next функция продолжения выполнения запроса
 */

function auth(req, res, next) {
  try {
    let token = req.headers["authorization"]
    if (!token) {
      return res.send("login required")
    }
    token = token.replace("Bearer ", "")

    jwt.verify(token, key.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "login required",
        })
      } else {
        req.userId = decoded._id
        next()
      }
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = auth
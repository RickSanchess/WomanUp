const User = require("../entity/users.model")

/**
 * Функция промежуточной обработки
 * Прикрепляет объект аутентифицированного пользователя
 * @func
 * @name user
 * @param req объект запроса
 * @param res объект ответа
 * @param next функция продолжения выполнения запроса
 */

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

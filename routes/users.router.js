const { Router } = require("express")
const router = Router()
const userService = require("../service/user.service")

/**
 * создание пользователя
 * @name post/user
 * @param {Object} req Объект запроса
 * @param {Object} req.body Объект запроса
 * @return {JSON} payload:{newUser,jwt}
 */

router.post("/register",async (req, res) => {
  try {
    const { code, ...payload } = await userService.create(req.body)
    console.log(code)
    console.log(payload)
    res.status(code).json(payload)
  } catch (e) {
    console.log(e)
  }
})

/**
 * Аутентификация пользователя
 * @name post/user
 * @param {object} req Объект запроса
 * @return {JSON} {token}
 */

router.post("/login",async (req, res) => {
  try {
    const { code, ...payload } = await userService.login(req.body)
    res.status(code).json(payload)
  } catch (e) {
    console.log(e)
  }
})

module.exports = router

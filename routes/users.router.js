const { Router } = require("express")
const router = Router()
const userService = require("../service/user.service")

router.post("/register", async (req, res) => {
  try {
    const { code, ...payload } = await userService.create(req.body)
    res.status(code).json({payload})
  } catch (e) {
    console.log(e)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { code, ...payload } = await userService.login(req.body)
    res.status(code).json({payload})
    } catch (e) {
    console.log(e)
  }
})

module.exports = router

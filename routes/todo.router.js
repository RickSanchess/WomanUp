const { Router } = require("express")
const router = Router()
const todoService = require("../service/todo.service")
const auth = require("../middleware/auth.middleware")
const user = require("../middleware/user.middleware")

router.post("/", auth, user, async (req, res) => {
  try {
    const { code, ...payload } = await todoService.create(req.body, req.user)
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

router.get("/", auth, user, async (req, res) => {
  try {
    console.log({ rout: "get one  " })
    const { code, ...payload } = await todoService.get(req.query, req.user._id)
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

router.delete("/:id", auth, user, async (req, res) => {
  try {
    const { code, ...payload } = await todoService.delete(
      req.params.id,
      user._id
    )
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

router.put("/:id", auth, user, async (req, res) => {
  try {
    const { code, ...payload } = await todoService.update(
      req.params.id,
      req.user._id,
      req.body.text
    )
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

module.exports = router

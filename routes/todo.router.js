const { Router } = require("express")
const router = Router()
const todoService = require("../service/todo.service")
const auth = require("../middleware/auth.middleware")
const user = require("../middleware/user.middleware")
const multer = require("multer")
const key = require("../keys/index")
const upload = multer({ dest: key.UPLOAD_DIR })

/**
 * Создание заметки
 * @name todo/post
 * @callback  auth middleware проверяет валидность jwt
 * @callback  user middleware
 * @callback  upload middleware, создает объект file и прикрепляет его к объекту res
 * @param {object} req Объект запроса
 * @param {object} req.user Объект авторизованного пользователя
 * @return {JSON} {newTodo}
 */

router.post(
  "/",
  auth,
  user,
  upload.single("file_save", 30),
  async (req, res) => {
    try {
      const { code, ...payload } = await todoService.create(req, req.user)
      res.status(code).json(payload)
    } catch (e) {
      console.log(e)
    }
  }
)

/**
 * Получение заметки/заметок
 * @name todo/get
 * @callback  auth middleware проверяет валидность jwt
 * @callback  user middleware
 * @param {object} req Объект запроса
 * @param {object} req.query Объект строки запроса
 * @param {string} req.userId Идентификатор авторизованного пользователя
 * @return {JSON} {todos}
 */

router.get("/", auth, user, async (req, res) => {
  try {
    const { code, ...payload } = await todoService.get(req.query, req.userId)
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

/**
 * удаление заметки
 * @name todo/delete
 * @callback  auth middleware проверяет валидность jwt
 * @param {object} req Объект запроса
 * @param {object} req.params Объект параметров запроса
 * @param {string} req.params.id Идентификатор заметки
 * @callback  user middleware
 * @return {JSON} {response}
 */

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { code, ...payload } = await todoService.delete(req.params.id)
    res.status(code).send(payload)
  } catch (e) {
    console.log(e)
  }
})

/**
 * Изменение заметки
 * @name todo/put
 * @callback auth middleware проверяет валидность jwt
 * @callback user middleware
 * @param {object} req Объект запроса
 * @returns {JSON} {updateTodo}
 */

router.put(
  "/:id",
  auth,
  user,
  async (req, res) => {
    try {
      const { code, ...payload } = await todoService.update(req)
      res.status(code).send(payload)
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * Добавляет файл к заметке
   * @name todo/post
   * @callback auth middleware проверяет валидность jwt
   * @callback upload middleware, создает объект file и прикрепляет его к объекту res
   * @param {object} req Объект запроса
   * @param {object} req.file Объект файла
   * @param {object} req.params.todoId Идентификатор заметки
   * @returns {JSON} {updateTodo}
   */

  router.post(
    "/:todoId",
    auth,
    upload.single("file_save", 30),
    async (req, res) => {
      try {
        const { code, ...payload } = await todoService.addFile(
          req.file,
          req.params.todoId
        )
        res.status(code).send(payload)
      } catch (e) {
        console.log(e)
      }
    }
  ),

  /**
   * Удаляет файл у заметки
   * @name todo/delete
   * @callback auth middleware проверяет валидность jwt
   * @param {object} req Объект запроса
   * @param {object} req.query Объект строки запроса
   * @param {string} req.query.fileId Идентификатор файла
   * @param {string} req.query.todoId Идентификатор заметки
   * @returns {JSON} {updateTodo}
   */

  router.delete("/file", auth, async (req, res) => {
    try {
      console.log("router")
      const { code, ...payload } = await todoService.deleteFile(
        req.query.fileId,
        req.query.todoId
      )
      res.status(code).send(payload)
    } catch (e) {
      console.log(e)
    }
  })
)

module.exports = router

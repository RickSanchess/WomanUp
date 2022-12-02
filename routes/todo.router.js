const { Router } = require("express")
const router = Router()
const todoService = require("../service/todo.service")
const auth = require("../middleware/auth.middleware")
const user = require("../middleware/user.middleware")
const multer = require("multer")
const key = require("../keys/index")

const storage = multer.diskStorage({
  destination: key.UPLOAD_DIR,
  filename: (req, file, callback)=> {
    callback(null, file.originalname)
  }
})
const upload = multer({storage})


/**
 * Создание заметки
 * @name post/todo
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
 * @name get/todo
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
 * @name delete/todo
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
 * @name put/todo
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
   * @name post/todo/file
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
   * @name delete/todo/file
   * @callback auth middleware проверяет валидность jwt
   * @param {object} req Объект запроса
   * @param {object} req.query Объект строки запроса
   * @param {string} req.query.fileId Идентификатор файла
   * @param {string} req.query.todoId Идентификатор заметки
   * @returns {JSON} {updateTodo}
   */

  router.delete("/file", auth, async (req, res) => {
    try {
      const { code, ...payload } = await todoService.deleteFile(
        req.query.fileId,
        req.query.todoId
      )
      res.status(code).send(payload)
    } catch (e) {
      console.log(e)
    }
  }),

  /**
   * Возвращает путь файла
   * @name get/todo/file
   * @callback auth middleware проверяет валидность jwt
   * @param {object} req Объект запроса
   * @param {object} req.params.todoId Идентификатор заметки
   * @returns {JSON} {path}
   */

  router.get('/file/:fileId', auth, async(req, res) => {
    try {
      const {code, ...payload} =await todoService.getFile(req.params.fileId)
      res.download(payload)

    } catch (error) {
      
    }
  })
)

module.exports = router

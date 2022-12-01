/**
 * Module dependencies.
 */
const Todo = require("../entity/todos.model")

/**
 * Объект с методами сущности Todo
 * @name todoService
 */

const todoService = {
  /**
   * Создает в базе данных сущность Todo
   * @param {Object} query Объект запроса
   * @param {string} query.body.title Название заметки
   * @param {string} query.body.text содержание заметки
   * @param {string} userId идентификатор пользователя
   * @returns {Object} newTodo
   */

  async create(query, userId) {
    const { title, text } = query.body

    let newTodo = new Todo({ title, text, creatorId: userId })
    if (query.file) {
      await newTodo.addFile(query.file)
    }
    newTodo = await newTodo.save()

    return {
      code: 200,
      newTodo,
    }
  },

  /**
   * Возвращает либо одну заметку по идентификатору, либо постранично
   * @param {Object} query Объект query запроса
   * @param {string} query.id идентификатор заметки
   * @param {string} query.page номер страницы
   * @param {string} query.pageSize  размер страницы
   * @param {string} userId идентификатор пользователя
   * @returns {Object} {todos}
   */

  async get(query, userId) {
    console.log(query)
    console.log(userId)
    const todos =
      query.id != 0
        ? await Todo.findById(query.id)
        : await Todo.find({ creatorId: userId })
            .sort("createDate")
            .skip(query.pageSize * --query.page)
            .limit(+query.pageSize)
    return {
      code: 200,
      todos,
    }
  },

  /**
   * Удаляет заметку
   * @param {string} todoId идентификатор заметки
   * @param {string} userId идентификатор пользователя
   * @returns {Object} код ответа и полезную нагрузку{code,payload}
   */

  async delete(todoId) {
    const response = await Todo.deleteOne({ _id: todoId })
    return {
      code: 200,
      response,
    }
  },

  /**
   * Обновляет заметку
   * @param {Object} query объект запроса
   * @param {string} query.params.id идентификатор заметки
   * @param {string} query.user._id идентификатор пользователя
   * @param {string} query.body.text новые данные для заметки
   * @returns {Object} {updateTodo}
   */

  async update(query) {
    const updateTodo = await Todo.findOneAndUpdate(
      { _id: query.params.id, creatorId: query.user._id },
      { text: query.body.text }
    )
    return {
      code: 200,
      updateTodo,
    }
  },

  /**
   * Добавляет файл к заметке
   * @param {Object} file объект файла
   * @param {string} todoId идентификатор заметки
   * @returns {Object} {updateTodo}
   */

  async addFile(file, todoId) {
    const todo = await Todo.findById(todoId)
    await todo.addFile(file)
    const updateTodo = await todo.save()
    return {
      code: 200,
      updateTodo,
    }
  },

  /**
   * Удаляет файл
   * @param {string} fileId Идентификатор файла
   * @param {string} todoId Идентификатор заметки
   */

  async deleteFile(fileId, todoId) {
    const todo = await Todo.findById(todoId)
    const updateTodo = await todo.deleteFile(fileId)
    await todo.save()
    return {
      code: 200,
      updateTodo,
    }
  },
}

module.exports = todoService

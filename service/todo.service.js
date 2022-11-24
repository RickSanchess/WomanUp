const Todo = require("../entity/todos.model")

const todoService = {
  async create(createData, userId) {
    const { title, text } = createData
    const todo = new Todo({ title, text, creator: userId })
    await todo.save()
    const createTodo = await todo.save()
    return {
      code: 200,
      createTodo,
    }
  },

  async get(query, userId) {
    const todo = +query.id
      ? await Todo.findById(query.id).populate("creator")
      : await Todo.find({ creator: userId })
          .sort("createDate")
          .skip(query.pageSize * --page)
          .limit(query.pageSize)

    return {
      code: 200,
      todo,
    }
  },

  async delete(todoId, userId) {

    const response = await Todo.deleteOne({ _id: todoId, creator: userId })
    return {
      code: 200, response
    }
  },

  async update(todoId,userId,text) {
    console.log(todoId)
    console.log(userId)
    const response = await Todo.updateOne({ _id: todoId, creator: userId }, {text})
    return {
      code: 200, response
    }
    
  },
}

module.exports = todoService

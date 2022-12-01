const { Schema, model } = require("mongoose")
const File = require("./file.model")
const { unlink } = require("node:fs/promises")

/**
 * Модель коллекции file
 * @class todos
 */

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  creatorId: { type: Schema.Types.ObjectId, ref: "User" },
  createDate: {
    type: Date,
    default: Date.now,
  },
})

/**
 * Метод добавляющий файлы к документу Todo
 * @param {Object} file объект файла
 * @returns объект документа
 */
todoSchema.methods.addFile = async function (file) {
  try {
    const { originalname, filename, mimetype, path } = file
    let newFile = await new File({
      originalname,
      filename,
      mimetype,
      path,
      todoId: this.id,
    })

    const files = [...this.files]
    files.push(newFile.id)
    this.files = files
    newFile = await newFile.save()

    return this
  } catch (error) {
    console.log(error)
  }
}

/**
 * Метод удаляющий файла
 * @param {string} fileId Идентификатор файла
 * @returns объект документа
 */
todoSchema.methods.deleteFile = async function (fileId) {
  try {
    console.log({ fileId })
    let files = [...this.files]
    console.log(fileId)
    files = files.filter((i) => i != fileId)
    this.files = files
    const deletingFile = await File.findByIdAndDelete(fileId)
    unlink(deletingFile.path, function (err) {
      if (err) throw err
    })
    return this
  } catch (error) {
    console.log(error)
  }
}

/**
 * Middleware, срабатывает каждый раз, когда вызывается метод
 * "deleteOne" у документа Todo. Удаляет все файлы,которые относятся
 * к документу Todo
 */

todoSchema.post("deleteOne", async function () {
  try {
    const files = await File.find({ todoId: this.getQuery()._id })
    files.forEach((i) => {
      unlink(i.path, function (err) {
        if (err) throw err
      })
    })
    return await File.deleteMany({ todoId: this.id })
  } catch (error) {}
})
module.exports = model("Todo", todoSchema)

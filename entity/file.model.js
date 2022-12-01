
const { Schema, model } = require("mongoose")

/**
 * Модель коллекции file
 * @class file
 */

const fileSchema = new Schema({
  originalname: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },

  mimetype: {
    type: String,
    required: true,
  },

  todoId: { type: Schema.Types.ObjectId, ref: "Todo" },
})

module.exports = model("File", fileSchema)

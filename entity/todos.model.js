const { Schema, model } = require("mongoose")

const todosSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },

  createDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model("Todo", todosSchema)

const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    descriptions: {
      type: String
    },
    content: {
      type: String,
      default: ""
    },
    coverImg: {
      type: String
    },
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Article", articleSchema)

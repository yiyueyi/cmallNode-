const mongoose = require("mongoose")

const modelSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: ""
    },
    views: {
      type: Number,
      default: 0
    },
    coverImg: {
      type: String
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    },
    status: {
      type: Number,
      default: 0
    },
    article: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Article"
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("ArticleComment", modelSchema)

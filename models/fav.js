const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    },
    article: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Article"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Fav", modelSchema);

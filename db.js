const mongoose = require("mongoose");
const { Book, BookCategory } = require("./models");

mongoose
  .connect("mongodb://localhost:27017/cat-shop", {
    useNewUrlParser: true
  })
  .then(res => {
    // console.log(res);
    console.log("数据库连接成功");
    Book.find({ id: "5def3ddcdf4b140e30dab5df" })
      .populate({
        path: "bookChapterCount"
      })
      .then(res => {
        console.log(res);
      });
  })
  .catch(err => {
    console.log(err);
  });

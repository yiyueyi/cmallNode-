const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { Fav } = require("../../models");
const { jwtSecret } = require("../../utils/config");

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const data = await Fav.find({ user: userId })
      .populate("article")
      .populate("user");
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let quantity = req.body.quantity || 1;
    quantity = quantity * 1;
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const { article } = req.body;
    const count = await Fav.count({
      user: userId,
      article
    });
    if (count > 0) {
      res.json({
        code: "success",
        message: "已经收藏此项目！"
      });
    } else {
      const fav = new Fav({
        user: userId,
        article
      });
      await fav.save();
      res.json({
        code: "success",
        message: "收藏成功！"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const delResult = await Fav.findByIdAndDelete(id);
    res.json(delResult);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

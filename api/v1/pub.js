const router = require("express").Router();
const { Article, ArticleComment, User } = require("../../models");
const { getLoginUserFromJWT } = require("../../utils/tools");

router.post("/articles", async (req, res, next) => {
  try {
    const userId = getLoginUserFromJWT(req);
    const model = new Article(req.body);
    model.user = userId;
    await model.save();
    res.json({
      code: "success",
      message: "发布文章成功"
    });
  } catch (err) {
    next(err);
  }
});

router.post("/comments/:a_id", async (req, res, next) => {
  try {
    const userId = getLoginUserFromJWT(req);
    const model = new ArticleComment(req.body);
    model.user = userId;
    model.article = req.params.a_id;
    await model.save();
    res.json({
      code: "success",
      message: "发布评论成功"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

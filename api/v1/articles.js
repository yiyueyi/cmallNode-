const router = require("express").Router();
const { Article, ArticleComment, User } = require("../../models");

router.get("/", async (req, res, next) => {
  const per = req.query.per * 1 || 10; // 每一页的数量
  const page = req.query.page || 1; // 页数
  if (page <= 0) {
    page = 1;
  }
  if (per <= 0) {
    per = 10;
  }
  let query = {};
  if (req.query.title) {
    query.title = new RegExp(req.query.title, "i");
  }

  const sort = req.query.sort || 1;
  const totalCount = await Article.find(query).count();
  const data = await Article.find(query)
    .populate("user")
    .sort({ createdAt: sort })
    .limit(per)
    .skip(per * (page - 1));
  res.json({
    totalCount,
    pages: Math.ceil(totalCount / per),
    data
  });
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const model = await Article.findById(id).populate("user");
    await Article.findByIdAndUpdate(id, {
      $inc: {
        views: 1 // 数量加1
      }
    });
    res.json(model);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;

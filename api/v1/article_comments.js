const router = require("express").Router();
const { Article, ArticleComment, User } = require("../../models");

// 根据id获取文章的评论
router.get("/:a_id", async (req, res, next) => {
  try {
    const per = req.query.per * 1 || 10; // 每一页的数量
    const page = req.query.page || 1; // 页数
    if (page <= 0) {
      page = 1;
    }
    if (per <= 0) {
      per = 10;
    }
    let query = {
      article: req.params.a_id
    };

    const sort = req.query.sort || 1;
    const totalCount = await ArticleComment.find(query).count();
    const data = await ArticleComment.find(query)
      .populate("user")
      .populate("article")
      .sort({ createdAt: sort })
      .limit(per)
      .skip(per * (page - 1));
    res.json({
      totalCount,
      pages: Math.ceil(totalCount / per),
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

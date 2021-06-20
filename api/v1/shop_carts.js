const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { ShopCart, Product } = require("../../models");
const { jwtSecret } = require("../../utils/config");

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const pids = await Product.find({}).select("id");
    const allPidArr = pids.map((item) => {
      return item.id;
    });
    const shopCarts = await ShopCart.find({
      user: userId,
      product: { $in: allPidArr }
    }).populate("product");
    res.json(shopCarts);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { product } = req.body; // 新增购物车时 只传递商品id即可
    let quantity = req.body.quantity || 1;
    quantity = quantity * 1;
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    await ShopCart.findOneAndUpdate(
      {
        user: userId,
        product
      },
      {
        $inc: {
          quantity // 数量加1
        }
      },
      {
        upsert: true // 如果不存在就创建
      }
    );
    res.json({
      code: "success",
      message: "加入购物车成功！"
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const delResult = await ShopCart.findByIdAndDelete(id);
    res.json(delResult);
  } catch (err) {
    next(err);
  }
});

/**
 * 删除多个记录，ids为数组
 */
router.post("/delmany", async (req, res, next) => {
  try {
    const { ids } = req.body;
    const delResult = await ShopCart.deleteMany({
      _id: { $in: ids }
    });
    res.json(delResult);
  } catch (err) {
    next(err);
  }
});

// router.get('/user', async (req, res, next) => {
//   try {
//     const { product } = req.body; // 新增购物车时 只传递商品id即可
//     const token = req.headers.authorization.split(' ')[1]; // 获取token
//     const decoded = jwt.verify(token, 'Arivin');
//     const { userId } = decoded;
//     res.json({userId});
//   } catch (err) {
//     next(err);
//   }
// })

module.exports = router;

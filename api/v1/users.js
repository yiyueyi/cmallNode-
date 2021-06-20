const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 对jwt数据进行加密处理
const { User, Manager } = require("../../models");
const { jwtSecret } = require("../../utils/config");
const user = require("../../models/user");

router.get("/info", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const user = await User.findById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/manager_info", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const user = await Manager.findById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/change_pwd", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const user = await User.findById(userId);
    const { password, oldPassword } = req.body;
    if (oldPassword && oldPassword && oldPassword.trim()) {
      const slat = bcrypt.genSaltSync(10);
      const pwd = bcrypt.hashSync(password, slat); // 对密码进行加密
      if (bcrypt.compareSync(oldPassword, user.password)) {
        await User.findByIdAndUpdate(userId, {
          password: pwd
        });
        res.json({
          code: "success",
          message: "修改密码成功"
        });
      } else {
        res.json({
          code: "error",
          message: "原始密码输入错误"
        });
      }
    } else {
      res.json({
        code: "error",
        message: "密码不能为空"
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/change_info", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // 获取token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId } = decoded;
    const { nickName, avatar } = req.body;
    await User.findByIdAndUpdate(userId, {
      nickName,
      avatar
    });
    res.json({
      code: "success",
      message: "修改用户信息成功"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

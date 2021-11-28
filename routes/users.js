const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

// router.get("/me", async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   res.send(user);
// });

router.post("/", async (req, res) => {
  //验证models/user里的validate函数，主要是通过joi返回的error信息
  const { error } = validate(req.body);
  //验证如果错误，返回400，bad requst
  if (error) return res.status(400).send(error.details[0].message);
  //看看用户注册的email是否在数据库中已有
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("用户邮箱已注册，请更换其他邮箱尝试。");
  //将通过验证的用户数据初始化
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  //加密用户密码
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  //保存到数据库
  await user.save();

  //生成jwt给client
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;

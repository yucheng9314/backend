const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
// const _ = require("lodash");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  //使用Joi验证用户登录发送过来的请求体
  const { error } = validate(req.body);
  //bad requst
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  //混淆用户错误提示
  if (!user) return res.status(400).send("错误邮箱或密码");
  //加密对比数据库中用户密码
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  //同样混淆用户错误提示
  if (!validPassword) return res.status(400).send("错误邮箱或密码");
  //通过验证后发送jwt给用户
  const token = user.generateAuthToken();

  res.send(token);
});

//验证用户登录请求
function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;

const mongoose = require("mongoose");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const UpImage = require("./models/imageUp");
const config = require("config");

const users = require("./routes/users");
const auth = require("./routes/auth");
//引入flie system系统
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use("/api/users", users);
app.use("/api/auth", auth);
// app.set("view engine", "ejs");

app.set("view engine", "pug");
//另一个可选配置，表示把所有的模版都放在views目录下
app.set("views", "./views");

app.get("/", (req, res) => {
  //第一个参数是创建.pug文件的名字，第二个参数是你要映射的对象体
  res.render("index", { title: "My Express App", message: "Hello World!" });
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// const upload = multer({ storage: storage });

// app.get("/", (req, res) => {
//   UpImage.find({}, (err, items) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("An error occurred", err);
//     } else {
//       res.render("imagesPage", { items: items });
//     }
//   });
// });

// app.post("/", upload.single("image"), (req, res, next) => {
//   const obj = {
//     name: req.body.name,
//     desc: req.body.desc,
//     img: {
//       data: fs.readFileSync(
//         path.join(__dirname + "/uploads/" + req.file.filename)
//       ),
//       contentType: "image/png",
//     },
//   };
//   UpImage.create(obj, (err, item) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // item.save();
//       res.redirect("/");
//     }
//   });
// });

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(config.get("db"))
  .then(() => console.log("Content to mongoDB..."))
  .catch(() => console.log("Could not content to mongoDB..."));

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Listening on port ${port}...`));

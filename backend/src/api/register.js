import axios from "axios";
import "dotenv/config";
import bcrypt from "bcrypt"; //node里面的一个加密手段，不管密码多长，生成出来哦都是一样长，就不好破解，saltRounds是加密的复杂度
import { usersDBPath, bcryptDBPath } from "../utils/dataPath.js";
//一般工程是数据库先行，然后做后端跟数据库互动，然后前段跟后端互动
async function register(req, res) {
  console.log("register");
  try {
    const users = await getUsers(); // 获取所有用户

    // 检查用户名是否已经存在
    const user = users.find((user) => user.username === req.body.username);
    if (user) {
      // 用户名已经存在
      return res.status(409).json({
        message: "Already have same username",
        code: "1",
        username: req.body.username,
      });
    } else if (!req.body.password) {
      // 密码为空
      return res.status(409).json({
        message: "Password is empty",
        code: "2",
        username: req.body.username,
      });
    } else {
      const saltRounds = await getSalt(); // 获取加密盐
      console.log(saltRounds);
      console.log(req.body.password);
      const hash = await bcrypt.hash(req.body.password + "", saltRounds); // 加密密码

      await axios.post(usersDBPath, {
        username: req.body.username,
        password: hash,
      });

      res.status(200).json({
        message: "Register success",
        code: "0",
        username: req.body.username,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function getUsers() {
  //抽离出来
  const getUsers = await axios.get(usersDBPath);
  const users = getUsers.data;
  return users;
}

async function getSalt() {
  //拿盐值，
  const getSaltRounds = await axios.get(bcryptDBPath);
  const saltRounds = getSaltRounds.data.saltRounds; //在db那里拿到盐值
  return saltRounds;
}

export { register };

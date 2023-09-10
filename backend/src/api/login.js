import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function login(req, res) {
  // const { username, password } = req.body;
  const username = req.body.username;
  const password = req.body.password;

  console.log(username, password);
  // 如果用path会吞掉http:// 中的一个/
  const userDataBasePath = process.env.DB_PATH + "/user";
  console.log(userDataBasePath);
  const users = await axios
    .get(userDataBasePath)
    .then((res) => res.data)
    .catch((err) => {
      // console.log(err)
    });

  if (!(users && Array.isArray(users) && users.length > 0)) {
    res.status(500).json({ message: "No users found", code: 2 });
  } else {
    const user = users.find((user) => user.username === username);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials", code: 1 });
    } else {
      //用bcrypt比较，因为密码是加密过的
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Invalid credentials", code: 1 });
        return;
      }

      const userTokenInfo = {
        username, //这里因为在else里面，是有user的，所以不用再user.username
        password: user.password, //user.password是加密过的
        date: new Date(),
      };

      //同步的不是异步的
      const token = jwt.sign(userTokenInfo, process.env.ACCESS_TOKEN_SECRET);

      res.status(200).json({ message: "Login successful", code: 0, token });
    }
  }
}

export { login };

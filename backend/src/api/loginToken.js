import axios from "axios";
import jwt from "jsonwebtoken";
import { usersDBPath } from "../utils/dataPath.js";

async function loginToken(req, res) {
  //这里不是通过body传的，而是req。login.js用的是body，因为login那里是从前端传来的时候，是用body打包的（跑postman的时候就知道区别），这里是后端传后端，所以没有经过打包。
  const username = req.username;
  const password = req.password;

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
    const user = users.find(
      //login那里需要验证，这里只需要比较相等，因为拿到就是密文
      (user) => user.username === username && user.password === password
    );
    if (!user) {
      res.status(401).json({ message: "Invalid credentials here", code: 1 });
    } else {
      const userTokenInfo = {
        username,
        password: user.password,
        date: new Date(),
      };
      //创造了新的token
      const newToken = jwt.sign(userTokenInfo, process.env.ACCESS_TOKEN_SECRET);

      //TODO:
      //直接获取传来的旧令牌的时间戳‘iat’
      const oldTokenIat = req.iat;

      //用jwt的decode方法解码新令牌并获取‘iat’时间戳
      const decodedNewToken = jwt.decode(newToken);
      const newTokenIat = decodedNewToken.iat;
      console.log("newIat: ", newTokenIat);

      //计算时间差
      const timeDifference = newTokenIat - oldTokenIat;

      const threshold = 60; //有效期一分钟
      // const oneHourThreshold = 3600 //有效期一小时
      // const weekThreshold = 7 * 24 * 60 * 60 //有效期一星期

      if (timeDifference <= threshold) {
        //时间差在阀值内，新令牌有效
        console.log("New Token is valid");
        res
          .status(200)
          // 发送响应，包括新令牌
          .json({ message: "Login successful", code: 0, newToken, user });
      } else {
        // 时间差超过阈值，新令牌已过期
        console.log("Token has expired");
        // 发送过期令牌的响应
        res.status(401).json({ message: "Token has expired", code: 1 });
      }

      // res.status(200).json({ message: "Login successful", code: 0, newToken });
    } //给前段返回一个user，因为前端不具备解析token的能力
  }
}

export { loginToken };

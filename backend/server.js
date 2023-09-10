import express from "express";
import cors from "cors";
import ip from "ip";
import bodyParser from "body-parser";
import "dotenv/config";

import { login } from "./src/api/login.js";
import { authToken } from "./src/auth/authToken.js";
import { loginToken } from "./src/api/loginToken.js";
import { register } from "./src/api/register.js";

const app = express();
app.use(cors({ origin: "*" }));

const jsonParser = bodyParser.json();

const port = process.env.PORT || 9090;

app.post("/api/login", jsonParser, login);
app.post("/api/loginToken", jsonParser, authToken, loginToken);
app.post("/api/register", jsonParser, register);

app.listen(port, () => {
  // console.clear();
  console.log(`Server running on port ${port}`);
  console.log(`http://${ip.address()}:${port}`);
});

//总结：首先在login做一个token，需要之前密钥先传进来，用username和加密过的密码，生成了token。token返回给前端。前端把token保存到local storage。下次登陆直接执行checktoken，请求头里面必须有之前存的token，然后把其抛到后端去。在authtoken把头拿出来，分出token，检查，成功就req（req.username 和 req.password)，再传给loginToken，比较username和password，对的话，就把整个信息拽走，user，传回给前端显示。前端拿到data，包括新的token，再保存一遍。最后登出的时候把token删除。

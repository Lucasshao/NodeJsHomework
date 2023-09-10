import "dotenv/config";
import jwt from "jsonwebtoken";

// 中间件
function authToken(req, res, next) {
  const headers = req.headers; //先拿到headers
  // console.log(headers);
  const token = headers.authorization.split(" ")[1];
  //再拿到token，这里因为headers的结构是Bearer + token，所以先拆分开，然后拿第二个就是token
  // console.log(token);

  if (!token)
    //如果token不存在
    return res.status(401).json({ code: 1, message: "No token provided." });

  //然后用jwt的verify功能（刚才用过sign功能），传入token，密文位置，解码。
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // console.log('JWT verify error: ', err)
      return res.status(401).json({ code: 2, message: "Unauthorized." });
    }

    // console.log(decoded);
    req.username = decoded.username;
    req.password = decoded.password;
    //然后用req提取出解码的username 和 password，然后下一步
    //解析出的username 和 password 本质上是没有区别的，跟login自己传是一样的。这时候有两种选择，1是让它做一个新的token（优势在于会更新，这个token下次登陆时候就变了（例如时间date会更新），如果再用老的token就对不上了。2是不更新token（好处是发的数据量会变少，工作量变少）坏处是没办法做到实时。
    //TODO:
    req.iat = decoded.iat; //获取令牌的‘iat’时间戳
    console.log("req.iat: ", req.iat);
  });
  next();
}

export { authToken };

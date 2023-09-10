import "dotenv/config";

export const usersDBPath = process.env.DB_PATH + "/user";
export const bcryptDBPath = process.env.DB_PATH + "/bcrypt/1";
//把db路线分离出来

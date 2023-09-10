import "./style.scss";
import axios from "axios";
import * as animation from "./src/animation";
import * as utils from "./src/utils";

const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const new_username = document.querySelector("#new-username");
const password_one = document.querySelector("#reg-password-one");
const password_two = document.querySelector("#reg-password-two");
const signOutBtn = document.querySelector("#sign-out");

loginBtn.addEventListener("click", login);
signOutBtn.addEventListener("click", signOut);
registerBtn.addEventListener("click", register);

const backendPath = "http://localhost:9098/api/";

async function login(event) {
  event.preventDefault();
  if (utils.checkInputEmpty([username, password])) {
    animation.showError();
    return;
  }

  try {
    const response = await axios
      .post(backendPath + "login", {
        username: username.value,
        password: password.value,
      })
      .then((res) => res.data);

    console.log(response);

    if (response.code === 0) {
      document.querySelector("#welcome-user-name").textContent = username.value;
      utils.clearDomValue([username, password]);
      animation.showCorrect();
      animation.LoginToWelcome();
      response.token && localStorage.setItem("token", response.token); //先确保有token，然后localStorage往里存，名字token，内容是response token
    }
  } catch (err) {
    console.log(err?.response?.data);
    const code = err?.response?.data?.code;
    switch (code) {
      case 1:
        animation.showError();
        break;
      case 2:
        animation.showUnknown();
        break;
      default:
        animation.showUnknown();
        break;
    }
  }
}

async function signOut(event) {
  event.preventDefault();
  utils.clearDomValue([username, password]);
  animation.WelcomeToLogin();
  localStorage.removeItem("token"); //登出就move token了
}

async function register(event) {
  event.preventDefault();
  if (utils.checkInputEmpty([new_username, password_one, password_two])) {
    animation.showError(); //检查是否empty，如果是就直接返回了
    return;
  } else if (password_one.value !== password_two.value) {
    animation.showError();
    return;
  } else {
    let errResponse = null;
    const response = await axios
      .post(backendPath + "register", {
        username: new_username.value,
        password: password_one.value,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        errResponse = err?.response?.data;
      });

    console.log(response, errResponse);

    switch (Number(response?.code || errResponse?.code)) {
      case 0:
        animation.showCorrect();
        utils.clearDomValue([new_username, password_one, password_two]);
        animation.RegisterToLogin();
        break;
      case 1:
        console.log("username already exist");
        animation.showUnknown();
        break;
      case 2:
        animation.showError();
        break;
      default:
        animation.showUnknown();
        break;
    }
  }
}

// ===== To Register and Login Btn Function=====
const toRegisterBtn = document.querySelector(".to-register-btn");
const toLoginBtn = document.querySelector(".to-login-btn");

toRegisterBtn.addEventListener("click", showRegister);
toLoginBtn.addEventListener("click", showLogin);

function showRegister(event) {
  event.preventDefault();
  animation.LoginToRegister();
}

function showLogin(event) {
  event.preventDefault();
  animation.RegisterToLogin();
}

async function checkToken() {
  const token = localStorage.getItem("token"); //先去localStorage里面拿token
  if (token) {
    // 此处为重点，一定要加上请求头，非常定式的要求，这个是配置文件
    const configuration = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios
        .post(backendPath + "loginToken", { test: "hello" }, configuration)
        .then((res) => res.data);

      if (response.code === 0) {
        document.querySelector("#welcome-user-name").textContent =
          response.user.username; //这里是loginToken39行那里传回来的
        animation.LoginToWelcome();
        response.token && localStorage.setItem("token", response.token);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
//在开始阶段直接跑，而其他几个都是鼠标点击才会跑，注意区别
checkToken();

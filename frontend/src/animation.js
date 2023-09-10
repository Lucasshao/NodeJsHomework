import { gsap } from "gsap";

class Animation {
  constructor(target) {
    this.target = target
  }

  comeIn(tween) {
    tween = tween || gsap.timeline()
    tween.to(this.target, { duration: 0, display: "none", opacity: 0, x: 0, y: 40 })
    tween.to(this.target, { duration: 0.5, display: "flex", opacity: 1, x: 0, y: 0 })
  }

  comeOut(tween) {
    tween = tween || gsap.timeline()
    tween.to(this.target, { duration: 0, display: "flex", opacity: 1, x: 0, y: 0 })
    tween.to(this.target, { duration: 0.5, display: "none", opacity: 0, x: 0, y: -40 })
  }
}

function AtoB(a, b, delay) {
  const tween = gsap.timeline({ delay: delay })
  a.comeOut(tween)
  b.comeIn(tween)
}

const animation = {
  login: new Animation('.login'),
  register: new Animation('.register'),
  welcome: new Animation('.welcome')
}


function RegisterToLogin() {
  AtoB(animation.register, animation.login, 0.1)
}

function LoginToRegister() {
  AtoB(animation.login, animation.register, 0.1)
}

function LoginToWelcome() {
  AtoB(animation.login, animation.welcome, 0.1)
}

function WelcomeToLogin() {
  AtoB(animation.welcome, animation.login, 0.1)
}


function basicShow(color) {
  const tween = gsap.timeline()
  tween.to('body', { duration: 0, background: '#fff' })
  tween.to('body', { duration: 1, ease: 'power2.inOut', background: color })
  tween.to('body', { duration: 1, ease: 'power2.inOut', background: '#fff' })
}

function showError() {
  basicShow('#ff7875')
}

function showCorrect() {
  basicShow('#52c41a')
}

function showUnknown() {
  basicShow('#ffa940')
}


export {
  RegisterToLogin,
  LoginToRegister,
  LoginToWelcome,
  WelcomeToLogin,
  showError,
  showCorrect,
  showUnknown
}
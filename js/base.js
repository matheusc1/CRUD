function saveToken(token) {
  localStorage.setItem('token', token)
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

function getToken() {
  return localStorage.getItem('token')
}

function getUser() {
  return localStorage.getItem('user') ?? "{}"
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  redirectToLogin()
}

function redirectToLogin() {
  window.open('login.html', '_self')
}

function userLogged() {
  let token = getToken()

  return !!token
}

function validateUser() {
  let logged = userLogged()

  if (window.location.pathname == '/login.html') {
    if (logged) {
      window.open('/index.html', '_self')
    }
  }
  else if (!logged && window.location.pathname == "/index.html") {
    redirectToLogin()
  }
}

validateUser()
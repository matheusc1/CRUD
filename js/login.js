const email = document.getElementById('floatingInput')
const password = document.getElementById('floatingPassword')
const loginBtn = document.getElementById('login-btn')
const errorMsg = document.getElementById('error-msg')

loginBtn.addEventListener('click', () => {
  let userEmail = email.value
  let userPassword = password.value

  if(!userEmail || !userPassword) {
    errorMsg.textContent = "Email e senha são obrigatórios!"
    return
  }

  authenticate(userEmail, userPassword)
})

async function authenticate(email, senha) {
  const url = `http://localhost:3400`

  try {
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({email, senha})
    })

    const data = await response.json()

    if(!!data.mensagem){
      errorMsg.textContent = data.mensagem
      return;
    }else{
      saveToken(data.token);
      saveUser(data.usuario);
    }

    console.log(data.usuario)

    window.open('index.html', '_self')
  } catch (error) {
    console.error(error)
  }
}
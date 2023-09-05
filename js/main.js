const URL = 'http://localhost:3400/clientes'

const clientList = []
let editMode = false

const body = document.querySelector('body')
const toggleBtn = document.getElementById('toggle-theme')
const themeStatus = document.getElementById('theme-status')

const username = document.getElementById('username')
const userEmail = document.getElementById('user-email')
const logoutBtn = document.getElementById('logout')
const avatar = document.getElementById('avatar')
const welcomeMsg = document.getElementById('welcome')

let clientNumber = document.getElementById('client-number')
const addBtn = document.getElementById('add-btn')
const clientTable = document.querySelector('table>tbody')

const editBtn = document.getElementById('edit-btn')
const deleteBtn = document.getElementById('delete-btn')

const clientModal = new bootstrap.Modal(document.getElementById('client-modal'))
const modalTitle = document.getElementById('modal-title')
const displayId = document.getElementById('id')
const cancelBtn = document.getElementById('cancel-btn')
const saveBtn = document.getElementById('save-btn')

const deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'))
const cancelDeleteBtn = document.getElementById('cancel-delete')
const confirmDeleteBtn = document.getElementById('confirm-delete')
let deleteClientId = null;

const formModal = {
  id: document.getElementById('id'),
  name: document.getElementById('name'),
  phoneNumber: document.getElementById('phone-number'),
  cpf: document.getElementById('cpf'),
  email: document.getElementById('email'),
}

getClients()
const user = JSON.parse(getUser());

if (user) {
  const { nome, email, foto } = user
  username.textContent = nome
  userEmail.textContent = email
  avatar.setAttribute('src', foto)
  welcomeMsg.textContent = `Olá ${nome}, 👋🏼`
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark')

  if (body.classList.contains('dark')) {
    themeStatus.textContent = 'on'
  } else {
    themeStatus.textContent = 'off'
  }
})

logoutBtn.addEventListener('click', logout)

addBtn.addEventListener('click', () => {
  clearModal()

  editMode = false;
  modalTitle.textContent = 'Adicionar cliente';
  displayId.value = clientList.length + 1;

  clientModal.show()
})

cancelBtn.addEventListener('click', () => {
  clientModal.hide()
  clearModal()
})

saveBtn.addEventListener('click', () => {
  let client = getModalData()

  if (editMode) {
    updateClientInfo(client)
  } else {
    addClient(client)
  }
})

async function getClients() {
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Authorization': getToken()
      }
    })

    clientList.length = 0;
    const data = await response.json()
    clientList.push(...data)

    populateTable(clientList)
  } catch (error) {
    console.error(error)
  }
}

function addTableRow(client) {
  let tr = document.createElement('tr')

  let tdId = document.createElement('td')
  let tdName = document.createElement('td')
  let tdPhoneNumber = document.createElement('td')
  let tdEmail = document.createElement('td')
  let tdCpf = document.createElement('td')
  let tdData = document.createElement('td')
  let tdActions = document.createElement('td')

  tdId.textContent = client.id;
  tdName.textContent = client.nome;
  tdPhoneNumber.textContent = formatedPhoneNumber(client.telefone);
  tdEmail.textContent = client.email;
  tdCpf.textContent = client.cpfOuCnpj;
  tdData.textContent = formatedData(client.dataCadastro);
  tdActions.innerHTML = `
    <button id="edit-btn" onclick="editClient(${client.id})">
      <i class="ph ph-pencil-simple"></i>
    </button>
    <button id="delete-btn" onclick="getDeleteId(${client.id})">
      <i id="delete-btn" class="ph ph-trash"></i>
    </button>`

  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdPhoneNumber);
  tr.appendChild(tdEmail);
  tr.appendChild(tdCpf);
  tr.appendChild(tdData);
  tr.appendChild(tdActions);

  clientTable.appendChild(tr)
}

function formatedPhoneNumber(phoneNumber) {
  let ddd = phoneNumber.slice(0, 2)
  let firstFour = phoneNumber.slice(3, 7)
  let lastFour = phoneNumber.slice(7)

  return `(${ddd}) ${firstFour}-${lastFour}`
}

function formatedData(data) {
  const date = new Date(data)

  const dateYMD = date.toLocaleDateString().slice(0, 11)
  const dateHM = date.toLocaleTimeString().slice(0, 5)

  return `${dateYMD} - ${dateHM}`
}

function populateTable(clients) {
  clientTable.textContent = "";

  clients.forEach(client => {
    addTableRow(client)
  });

  clientNumber.textContent = clientList.length
}

function getModalData() {
  return new Client({
    id: formModal.id.value,
    nome: formModal.name.value,
    telefone: formModal.phoneNumber.value,
    cpfOuCnpj: formModal.cpf.value,
    email: formModal.email.value,
    dataCadastro: new Date().toISOString()
  })
}

async function addClient(client) {
  client.dataCadastro = new Date().toISOString()

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken(),
      },
      body: JSON.stringify(client)
    })

    const data = await response.json()
    const newClient = new Client(data)

    clientList.push(newClient)
    populateTable(clientList)
    clientModal.hide()
  } catch (error) {
    console.error(error)
  }
}

function editClient(id) {
  editMode = true;
  modalTitle.textContent = "Editar cliente"
  displayId.value = id;

  let client = clientList.find(client => client.id == id)
  updateClientModal(client, false)
  clientModal.show()
}

function updateClientInfo(client) {
  try {
    fetch(`${URL}/${client.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken(),
      },
      body: JSON.stringify(client)
    })
    
    updateClient(client)
    clientModal.hide()

  } catch (error) {
    console.log(error)
  }
}

function updateClient(client, remove) {
  let index = clientList.findIndex((c) => c.id == client.id)

  if(remove) {
    clientList.splice(index, 1)
  } else {
    clientList.splice(index, 1, client)
  }
  
  populateTable(clientList)
}

function updateClientModal(client) {
  formModal.id.value = client.id
  formModal.name.value = client.nome
  formModal.phoneNumber.value = client.telefone
  formModal.cpf.value = client.cpfOuCnpj
  formModal.email.value = client.email
}

function clearModal() {
  const inputs = document.querySelectorAll('.form-control')

  inputs.forEach(input => {
    input.value = ""
  })
}

function deleteClient(id) {
  let client = clientList.find(client => client.id == id)
  try {
    fetch(`${URL}/${id}`), {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': getToken(),
      },
    }
    updateClient(client, true)
  } catch (error) {
    console.error(error)
  }
}

function getDeleteId(id) { 
  deleteClientId = id;
  deleteModal.show()
}

confirmDeleteBtn.addEventListener('click', () => {
  if (deleteClientId) {
    deleteClient(deleteClientId)
  }

  deleteModal.hide()
})

cancelDeleteBtn.addEventListener('click', () => {
  deleteClientId = null;
  deleteModal.hide()
})
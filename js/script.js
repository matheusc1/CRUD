const URL = 'http://localhost:3400/clientes'

const clientList = []
let editMode = false

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
  name: document.getElementById('name'),
  phoneNumber: document.getElementById('phone-number'),
  cpf: document.getElementById('cpf'),
  email: document.getElementById('email'),
}

getClients()

document.addEventListener('DOMContentLoaded', () => {
  addBtn.addEventListener('click', () => {
  
    editMode = false;
    modalTitle.textContent = 'Adicionar cliente';
    displayId.value = clientList.length + 1;
  
    clientModal.show()
  })
})

cancelBtn.addEventListener('click', () => {
  clientModal.hide()
  const inputs = document.querySelectorAll('.form-control')

  inputs.forEach(input => {
    input.value = ""
  })
})

saveBtn.addEventListener('click', () => {
  let client = getModalData()
  addClient(client)
})

async function getClients() {
  try {
    const response = await fetch(URL)

    clientList.length = 0;
    const data = await response.json()
    clientList.push(...data)
    clientNumber.textContent = clientList.length

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
  let year = data.slice(0, 4)
  let month = data.slice(5, 7)
  let day = data.slice(8, 10)

  let hour = data.slice(11, 13)
  let minute = data.slice(14, 16)

  return `${day}/${month}/${year} - ${hour}:${minute}`
}

function populateTable(clients) {
  clientTable.textContent = "";

  clients.forEach(client => {
    addTableRow(client)
  });
}

function getModalData() {
  return new Client({
    nome: formModal.name.value,
    telefone: formModal.phoneNumber.value,
    cpfOuCnpj: formModal.cpf.value,
    email: formModal.email.value,
  })
}

async function addClient(client) {
  client.dataCadastro = new Date().toISOString()

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Autorization': 'token',
      },
      body: JSON.stringify(client)
    })

    const data = await response.json()
    const newClient = new Client(data)

    clientList.push(newClient)
    populateTable(clientList)
    clientModal.hide()
    clientNumber.textContent = clientList.length

  } catch (error) {
    console.error(error)
  }
}

function editClient(id) {
  editMode = true;
  modalTitle.textContent = "Editar cliente"
  displayId.value = id;
  clientModal.show()
}

function deleteClient(id) {
  console.log(id)
}

function getDeleteId(id) { 
  deleteClientId = id;
  deleteModal.show()
}

confirmDeleteBtn.addEventListener('click', () => {
  if (deleteClientId !== null) {
    deleteClient(deleteClientId)
  }

  deleteModal.hide()
})

cancelDeleteBtn.addEventListener('click', () => {
  deleteClientId = null;
  deleteModal.hide()
})
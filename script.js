const URL = 'http://localhost:3400/clientes'

const clientList = []
const addBtn = document.getElementById('add-btn')
const clientTable = document.querySelector('table>tbody')
const editBtn = document.getElementById('edit-btn')
const deleteBtn = document.getElementById('delete-btn')
const clientModal = new bootstrap.Modal(document.getElementById('client-modal'))
const modalTitle = document.getElementById('modal-title')
const saveBtn = document.getElementById('save-btn')
const cancelBtn = document.getElementById('cancel-btn')

let editMode = false

getClients()

addBtn.addEventListener('click', () => clientModal.show())

async function getClients() {
  try {
    const response = await fetch(URL)

    const clientList = await response.json()  
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
    <i id="edit-btn" class="ph ph-pencil-simple"></i>
    <i id="delete-btn" class="ph ph-trash"></i>`

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

function editClient(id) {}
function deleteClient(id) {}
const socket = io()
const formUser = document.querySelector('#formUser')
const inputUser = document.querySelector('#inputUser')
const messages = document.querySelector('#messages')
const formMessage = document.querySelector('#formMessage')
const inputMessage = document.querySelector('#inputMessage')
const clock = document.querySelector('#clock')
const userContianer = document.querySelector('#userContainer')
userContianer.className = 'glow'
const user = document.getElementById('user')
const message = document.getElementById('message')
const h2Messages = document.querySelector('#h2-messages')
let myUser

formUser.addEventListener('submit', function (e) {
  e.preventDefault()
  myUser = inputUser.value
  userContianer.innerHTML = '<h2>Welcome ' + myUser + '</h2>'
  user.style.display = 'none'
  message.style.display = 'block'
  h2Messages.style.display = 'block'
})
inputUser.value = ''

formMessage.addEventListener('submit', function (e) {
  e.preventDefault()
  if (inputMessage.value) {
    socket.emit('chatMessage', { user: myUser, message: inputMessage.value })
    inputMessage.value = ''
  }
})

socket.on('time', function (timeMsg) {
  clock.innerHTML = timeMsg
})

socket.on('newChatMessage', function (msg) {
  let hr = document.createElement('hr')
  let item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  messages.appendChild(hr)
})

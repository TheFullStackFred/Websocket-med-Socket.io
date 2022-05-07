const socket = io()

const messages = document.querySelector('#messages')
const form = document.querySelector('#form')
const input = document.querySelector('#input')
const clock = document.querySelector('#clock')
clock.className = 'clock'

form.addEventListener('submit', function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit('chatMessage', input.value)
    input.value = ''
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

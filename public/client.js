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
const h2Messages = document.querySelector('#h2Messages')
const diceBtn = document.getElementById('diceBtn')
const diceElement = document.getElementById('diceElement')
const audio = document.getElementById('audio')
const nameBtn = document.getElementById('nameBtn')
let myUser

const play = () => {
  audio.play()
}
nameBtn.addEventListener('click', play)

formUser.addEventListener('submit', (e) => {
  e.preventDefault()
  myUser = inputUser.value
  userContianer.innerHTML = '<h2>Welcome ' + myUser + '</h2>'
  user.style.display = 'none'
  message.style.display = 'block'
  h2Messages.style.display = 'block'
})
inputUser.value = ''

formMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  if (inputMessage.value) {
    socket.emit('chatMessage', { user: myUser, message: inputMessage.value })
    inputMessage.value = ''
  }
})
inputMessage.value = ''

//DICE
let dice = {
  sides: 6,
  roll: function () {
    let randomNumber = Math.floor(Math.random() * this.sides) + 1
    return randomNumber
  }
}

let numbers = []
const printNumber = (number) => {
  numbers.push(number)
  console.log('Singlevalue:', number)
  const sum = numbers.reduce((x, xx) => x + xx)
  const singleValue = numbers.reduce((x, xx) => (x = xx))
  socket.emit('roll', { user: myUser, value: singleValue, totalValue: sum })
}

diceBtn.addEventListener('click', (e) => {
  e.preventDefault()
  diceElement.style.display = 'block'
  let result = dice.roll()
  printNumber(result)
})

socket.on('time', (timeMsg) => {
  clock.innerHTML = timeMsg
})

socket.on('newChatMessage', (msg) => {
  let hr = document.createElement('hr')
  let item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  messages.appendChild(hr)
})

socket.on('newRoll', (roll) => {
  diceElement.innerHTML = roll
})

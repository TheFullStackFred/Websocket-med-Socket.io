const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = 3000

app.use(express.static('public'))

// Time for frontend
setInterval(() => {
  let today = new Date()
  let time =
    'The time is ' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds() +
    ' and its time to chat'
  io.emit('time', time)
}, 1000)

//Time for backend
let todayStamp = new Date()
let timeStamp =
  todayStamp.getHours() +
  ':' +
  todayStamp.getMinutes() +
  ':' +
  todayStamp.getSeconds()

io.on('connection', (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`)

  socket.on('chatMessage', (msg) => {
    io.emit('newChatMessage', msg.user + ' : ' + msg.message)
    console.log(`Client: ${socket.id}, Sent: ${msg}, At: ${timeStamp} `)
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`)
  })
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = 3000

const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
let db

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db('nodesocket')
    messages = db.collection('messages')
    values = db.collection('values')
  }
)

app.use(express.static('public'))

//Endpoint for messages
app.get('/messages', (req, res) => {
  messages.find().toArray((err, items) => {
    if (err) throw err
    res.json({ messages: items })
  })
})

//Endpoint for values
app.get('/values', (req, res) => {
  values.find().toArray((err, items) => {
    if (err) throw err
    res.json({ values: items })
  })
})

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
    ' and its time to chat 🥳'
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
  console.log(`A client with id ${socket.id} connected to the chat`)

  socket.on('chatMessage', (msg) => {
    io.emit('newChatMessage', msg.user + ' : ' + msg.message)
    console.log(`Client: ${msg.user}, Sent: ${msg.message}, At: ${timeStamp} `)
    messages.insertOne(
      {
        user: msg.user,
        message: msg.message,
        time: timeStamp
      },
      (err, result) => {
        if (err) throw err
        console.log(result)
      }
    )
  })

  socket.on('roll', (roll) => {
    io.emit(
      'newRoll',
      `${roll.user} rolled a ${roll.value} and the total value is ${roll.totalValue}`
    )
    values.insertOne(
      {
        user: roll.user,
        singlevalue: roll.value,
        totalvalue: roll.totalValue,
        time: timeStamp
      },
      (err, result) => {
        if (err) throw err
        console.log(result)
      }
    )
    console.log(
      `${roll.user} rolled a ${roll.value} and the total value is ${roll.totalValue}`
    )
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`)
  })
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})

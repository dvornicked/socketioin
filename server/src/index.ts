import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

const port = 3001
const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	socket.on('message', (data) => {
		socket.broadcast.emit('message', data)
	})
})

server.listen(port, () =>
	console.log(`Server started: http://localhost:${port}`),
)

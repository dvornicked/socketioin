import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import { useState, KeyboardEvent, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface IMessage {
	id: number
	event: 'message' | 'connection'
	username: string
	message?: string
}

export const SocketComponent = () => {
	const [messages, setMessages] = useState<IMessage[]>([])
	const [value, setValue] = useState<string>('')
	const socket = useRef<Socket>()
	const [connected, setConnected] = useState(false)
	const [username, setUsername] = useState('')

	if (!connected)
		return (
			<>
				<Text align="center" fontSize="xl" mb="4">
					SocketIO
				</Text>
				<Flex>
					<Input
						value={username}
						onChange={(e: KeyboardEvent<HTMLInputElement>) => {
							setUsername(e.target.value)
						}}
						placeholder="Enter your name"
						type="text"
					/>
					<Button
						onClick={() => {
							socket.current = io('http://localhost:3001')
							const message: IMessage = {
								event: 'connection',
								username,
								id: Date.now(),
							}
							socket.current.on('connect', () => {
								console.log(socket.current?.id)
								setConnected(true)

								socket.current?.emit('message', message)
								socket.current?.on('message', (data) =>
									setMessages((prev) => [data, ...prev]),
								)
							})
							setMessages((prev) => [message, ...prev])
						}}
					>
						Enter
					</Button>
				</Flex>
			</>
		)

	return (
		<>
			<Text align="center" fontSize="xl" mb="4">
				SocketIO
			</Text>
			<Flex>
				<Input
					value={value}
					onChange={(e: KeyboardEvent<HTMLInputElement>) => {
						setValue(e.target.value)
					}}
					type="text"
				/>
				<Button
					onClick={async () => {
						const message: IMessage = {
							id: Date.now(),
							username,
							message: value,
							event: 'message',
						}
						socket.current?.emit('message', message)
						setValue('')
						setMessages((prev) => [message, ...prev])
					}}
				>
					Send
				</Button>
			</Flex>
			<VStack>
				{messages.map((item) => (
					<Box key={item.id}>
						{item.event === 'connection'
							? `User ${item.username} connected`
							: item.message}
					</Box>
				))}
			</VStack>
		</>
	)
}

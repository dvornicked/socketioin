import { Container } from '@chakra-ui/react'
import { SocketComponent } from './Socket'

export const App = () => {
	return (
		<Container my="12">
			<SocketComponent />
		</Container>
	)
}

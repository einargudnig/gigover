import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { Logo } from './logo';

export const Navbar = () => {
	return (
		<Box marginBottom={10} padding={4} paddingX={'36px'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box>
					<Flex alignItems={'center'}>
						<Logo color={'black'} scale={0.8} />
					</Flex>
				</Box>
				<Spacer />
				<Box>
					<Flex justifyContent={'space-between'}>
						<Button colorScheme="black" variant="link" marginRight={6}>
							Log in
						</Button>
						<Button>Sign up</Button>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
};

import { Link } from 'react-router-dom';
import { Box, Button, Flex, Spacer, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from './logo';

export const Navbar = () => {
	return (
		<Box as="nav" marginBottom={10} padding={4} paddingX={'36px'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box>
					<Flex alignItems={'center'}>
						<Link to="/">
							<Logo color={'black'} scale={0.8} />
						</Link>
					</Flex>
				</Box>
				<Box marginLeft={10}>
					<Flex>
						<Button colorScheme="black" variant="link" marginRight={6}>
							<Link to="/features">Features</Link>
						</Button>
						<Button colorScheme="black" variant="link" marginRight={6}>
							<Link to="/pricing">Pricing</Link>
						</Button>
						<Button colorScheme="black" variant="link" marginRight={6}>
							<Link to="/blog">Blog</Link>
						</Button>
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

export const MobileNavbar = () => {
	const { isOpen, onToggle } = useDisclosure();
	return (
		<Box marginBottom={10} padding={4} paddingX={'36px'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box>
					<Flex alignItems={'center'}>
						<Link to="/">
							<Logo color={'black'} scale={0.8} />
						</Link>
					</Flex>
				</Box>

				<Spacer />
				<Box>
					<HamburgerIcon />
					{/* <Flex justifyContent={'space-between'}>
						<Button colorScheme="black" variant="link" marginRight={6}>
							Log in
						</Button>
						<Button>Sign up</Button>
					</Flex> */}
				</Box>
			</Flex>
		</Box>
	);
};

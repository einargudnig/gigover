import React from 'react';
import { Link } from 'react-router-dom';
import {
	Box,
	Button,
	CloseButton,
	Flex,
	HStack,
	IconButton,
	VStack,
	VisuallyHidden,
	chakra,
	useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from './logo';

export const Navbar = () => {
	const mobileNav = useDisclosure();

	return (
		<React.Fragment>
			<chakra.header
				bg={'white'}
				w="full"
				px={{
					base: 2,
					sm: 4
				}}
				py={4}
				position="sticky" // This makes the header stick at the top
				top={0} // Stick at 0px from the top
				zIndex={20} // Ensures the header is above other content
			>
				<Flex alignItems="center" justifyContent="space-between" mx="auto">
					<Flex alignItems={'center'}>
						<Box>
							<chakra.a
								href="/"
								title="Gigover Home Page"
								display="flex"
								alignItems="center"
							>
								<Logo color="black" scale={0.7} />
								<VisuallyHidden>Gigover</VisuallyHidden>
							</chakra.a>
						</Box>
						<Box marginLeft={6}>
							<HStack
								display={{
									base: 'none',
									md: 'inline-flex'
								}}
							>
								<Button variant="ghost" colorScheme="black">
									<Link to="/features">Features</Link>
								</Button>
								<Button variant="ghost" colorScheme="black">
									<Link to="/pricing">Pricing</Link>
								</Button>
								<Button variant="ghost" colorScheme="black">
									<Link to="/blog">Blog</Link>
								</Button>
							</HStack>
						</Box>
					</Flex>
					<HStack display="flex" alignItems="center" spacing={1}>
						<HStack
							spacing={1}
							mr={1}
							color="black"
							display={{
								base: 'none',
								md: 'inline-flex'
							}}
						>
							<Button variant="ghost" colorScheme="black">
								Log in
							</Button>
						</HStack>
						<Button colorScheme="yellow">
							<Link to="https://web.gigover.com/">Sign up</Link>
						</Button>
						<Box
							display={{
								base: 'inline-flex',
								md: 'none'
							}}
						>
							<IconButton
								display={{
									base: 'flex',
									md: 'none'
								}}
								aria-label="Open menu"
								fontSize="20px"
								color="gray.800"
								_dark={{
									color: 'inherit'
								}}
								variant="ghost"
								icon={<HamburgerIcon />}
								onClick={mobileNav.onOpen}
							/>

							<VStack
								pos="absolute"
								top={0}
								left={0}
								right={0}
								display={mobileNav.isOpen ? 'flex' : 'none'}
								flexDirection="column"
								p={2}
								pb={4}
								m={2}
								bg={'white'}
								spacing={3}
								rounded="sm"
								shadow="sm"
							>
								<CloseButton aria-label="Close menu" onClick={mobileNav.onClose} />

								<Button w="full" variant="ghost" colorScheme="black">
									<Link to="/features">Features</Link>
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									<Link to="/pricing">Pricing</Link>
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									<Link to="/blog">Blog</Link>
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									Log in
								</Button>
								<Button w="full" variant="solid" colorScheme="yellow">
									<Link to="https://web.gigover.com/">Sign up</Link>
								</Button>
							</VStack>
						</Box>
					</HStack>
				</Flex>
			</chakra.header>
		</React.Fragment>
	);
};

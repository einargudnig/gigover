import React from 'react';
import { Link } from 'react-router-dom';
import {
	Box,
	Button,
	CloseButton,
	Flex,
	HStack,
	IconButton,
	Spacer,
	VStack,
	VisuallyHidden,
	chakra,
	useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
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
			>
				<Flex alignItems="center" justifyContent="space-between" mx="auto">
					<Flex>
						<chakra.a
							href="/"
							title="Gigover Home Page"
							display="flex"
							alignItems="center"
						>
							<Logo color="black" scale={0.7} />
							<VisuallyHidden>Gigover</VisuallyHidden>
						</chakra.a>
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
								<Link to="/features">Features</Link>
							</Button>
							<Button variant="ghost" colorScheme="black">
								Pricing
							</Button>
							<Button variant="ghost" colorScheme="black">
								Blog
							</Button>

							<Button variant="ghost" colorScheme="black">
								Log in
							</Button>
						</HStack>
						<Button colorScheme="yellow">Sign up</Button>
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
									Features
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									Pricing
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									Blog
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									Company
								</Button>
								<Button w="full" variant="ghost" colorScheme="black">
									Sign in
								</Button>
							</VStack>
						</Box>
					</HStack>
				</Flex>
			</chakra.header>
		</React.Fragment>
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

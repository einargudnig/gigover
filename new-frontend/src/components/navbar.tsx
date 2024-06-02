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
				paddingX={['10px', '165px']}
				py={4}
				position="sticky" // This makes the header stick at the top
				top={0} // Stick at 0px from the top
				zIndex={20} // Ensures the header is above other content
			>
				<Box>
					<Flex alignItems="center" justifyContent="space-between" mx="auto">
						<Flex alignItems={'center'} justifyContent={'center'}>
							<Box paddingX={'20px'}>
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
							<Box marginLeft={4}>
								<HStack
									spacing={'24px'}
									display={{
										base: 'none',
										md: 'inline-flex'
									}}
								>
									<Button
										variant="link"
										colorScheme="black"
										_hover={{ textColor: 'yellow.500' }}
									>
										<Link to="/features">Features</Link>
									</Button>

									<Button
										variant="link"
										colorScheme="black"
										_hover={{ textColor: 'yellow.500' }}
									>
										<Link to="/pricing">Pricing</Link>
									</Button>
									<Button
										variant="link"
										colorScheme="black"
										_hover={{ textColor: 'yellow.500' }}
									>
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
								{/* <Button
									variant="link"
									colorScheme="black"
									_hover={{ textColor: 'yellow.500' }}
									marginRight={2}
								>
									Log in
								</Button> */}
							</HStack>
							<Button colorScheme="yellow" _hover={{ bg: 'yellow.900' }}>
								<Link to="https://web.gigover.com/">Log in</Link>
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
									<CloseButton
										aria-label="Close menu"
										onClick={mobileNav.onClose}
									/>

									<Button w="full" variant="link" colorScheme="black">
										<Link to="/features">Features</Link>
									</Button>
									<Button w="full" variant="link" colorScheme="black">
										<Link to="/pricing">Pricing</Link>
									</Button>
									<Button w="full" variant="link" colorScheme="black">
										<Link to="/blog">Blog</Link>
									</Button>
									{/* <Button w="full" variant="link" colorScheme="black">
										Log in
									</Button> */}
									<Button w="full" variant="solid" colorScheme="yellow">
										<Link to="https://web.gigover.com/">Log in</Link>
									</Button>
								</VStack>
							</Box>
						</HStack>
					</Flex>
				</Box>
			</chakra.header>
		</React.Fragment>
	);
};

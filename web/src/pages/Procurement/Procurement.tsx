import { Box, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { ModalContext } from '../../context/ModalContext';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const location = useLocation();

	const isTenderRoute = location.pathname === '/tender';

	const notifications = {
		unread: 0
	};

	return (
		<>
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						<Button
							onClick={() => setModalContext({ addTender: { tender: undefined } })}
						>
							New Tender
						</Button>
					</>
				}
				extraNav={
					<Flex
						borderBottom={'1px'}
						backgroundColor={'white'}
						borderColor={'gray.400'}
						alignItems={'center'}
						px={3}
						py={1}
						height={'48px'}
					>
						<Box>
							<HStack>
								<NavLink to={'/tender'} end>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Tender
										</Box>
									)}
								</NavLink>

								<NavLink to={'client-answer'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Bid Received
										</Box>
									)}
								</NavLink>
								<NavLink to={'create-bid'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Create Bid
										</Box>
									)}
								</NavLink>
								<NavLink to={'tender-offers'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Offers Received
										</Box>
									)}
								</NavLink>
								<NavLink to={'bidder-offers'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Submitted Offers
										</Box>
									)}
								</NavLink>
								<NavLink to={'bidder-tenders'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'blue.400'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.700'
											}}
										>
											Tender Invitations
										</Box>
									)}
								</NavLink>
							</HStack>
						</Box>
					</Flex>
				}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<Outlet />
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};

import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { Outlet, NavLink } from 'react-router-dom';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const location = useLocation();

	const isTenderRoute = location.pathname === '/tender';

	// const notifications = {
	// 	unread: 3
	// };

	return (
		<>
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						<HStack>
							{isTenderRoute ? null : (
								<NavLink to={'/tender'}>
									<Button>Tender</Button>
								</NavLink>
							)}
							{/* <NavLink to={'client-answer'}>
								{({ isActive }) => (
									<Button
										colorScheme={isActive ? 'black' : 'yellow'}
										variant={isActive ? 'outline' : 'solid'}
									>
										Client Answer
										{notifications.unread > 0 && (
											<Flex
												align={'center'}
												justify={'center'}
												bg={'red.500'}
												borderRadius={'200px'}
												position={'absolute'}
												bottom={'-4px'}
												right={'-4px'}
												height={'16px'}
												width={'16px'}
											>
												<Box
													color={'white'}
													fontSize={'10px'}
													fontWeight={'bold'}
												>
													{notifications.unread}
												</Box>
											 </Flex>
										)}
									</Button>
								)}
							</NavLink>
							<NavLink to={'create-bid'}>
								{({ isActive }) => (
									<Button
										colorScheme={isActive ? 'black' : 'yellow'}
										variant={isActive ? 'outline' : 'solid'}
									>
										Create Bid
									</Button>
								)}
							</NavLink> */}
							<NavLink to={'tender-offers'}>
								{({ isActive }) => (
									<Button
										colorScheme={isActive ? 'black' : 'yellow'}
										variant={isActive ? 'outline' : 'solid'}
									>
										Offers Received
										{/* {notifications.unread > 0 && (
											<Flex
												align={'center'}
												justify={'center'}
												bg={'red.500'}
												borderRadius={'200px'}
												position={'absolute'}
												bottom={'-4px'}
												right={'-4px'}
												height={'16px'}
												width={'16px'}
											>
												<Box
													color={'white'}
													fontSize={'10px'}
													fontWeight={'bold'}
												>
													{notifications.unread}
												</Box>
											</Flex>
										)} */}
									</Button>
								)}
							</NavLink>
							<NavLink to={'bidder-offers'}>
								{({ isActive }) => (
									<Button
										colorScheme={isActive ? 'black' : 'yellow'}
										variant={isActive ? 'outline' : 'solid'}
									>
										Submitted Bids
									</Button>
								)}
							</NavLink>
							<NavLink to={'bidder-tenders'}>
								{({ isActive }) => (
									<Button
										colorScheme={isActive ? 'black' : 'yellow'}
										variant={isActive ? 'outline' : 'solid'}
									>
										Bid Invitations
										{/* {notifications.unread > 0 && (
											<Flex
												align={'center'}
												justify={'center'}
												bg={'red.500'}
												borderRadius={'200px'}
												position={'absolute'}
												bottom={'-4px'}
												right={'-4px'}
												height={'16px'}
												width={'16px'}
											>
												<Box
													color={'white'}
													fontSize={'10px'}
													fontWeight={'bold'}
												>
													{notifications.unread}
												</Box>
											</Flex>
										)} */}
									</Button>
								)}
							</NavLink>
						</HStack>

						{/* by adding addTender as a parameter to the setModalContext I'm  `selecting` what modal to use. */}
						{/* <Button
							onClick={() => setModalContext({ addTender: { tender: undefined } })}
							leftIcon={<PlusIcon />}
						>
							New Tender
						</Button> */}
					</>
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

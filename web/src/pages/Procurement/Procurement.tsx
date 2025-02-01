import { Box, Button, Flex, HStack, IconButton, Spacer, Tooltip, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { ModalContext } from '../../context/ModalContext';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [showCreateBidButton, setShowCreateBidButton] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const location = useLocation();

	const { data } = useUserTenders();

	useEffect(() => {
		if (location.pathname.includes('create-bid')) {
			setShowCreateBidButton(true);
		} else {
			setShowCreateBidButton(false);
		}
	}, [location.pathname]);

	return (
		<>
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<DisabledComponent>
						{showSearch ? (
							<ProcurementSearchBar tenders={data} />
						) : (
							<Tooltip hasArrow label="Search tender">
								<IconButton
									variant={'outline'}
									aria-label={'Search'}
									colorScheme={'gray'}
									icon={<SearchIcon color={'black'} />}
									onClick={() => setShowSearch((v) => !v)}
								/>
							</Tooltip>
						)}

						<Button
							onClick={() => setModalContext({ addTender: { tender: undefined } })}
						>
							New Tender
						</Button>
					</DisabledComponent>
				}
				extraNav={
					<DisabledComponent>
						<Flex
							borderBottom={'1px'}
							backgroundColor={'white'}
							borderColor={'gray.400'}
							alignItems={'center'}
							px={3}
							py={1}
							height={'50px'}
						>
							<Flex>
								<Box>
									<HStack>
										<Tooltip hasArrow label="View tenders">
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
										</Tooltip>

										<Tooltip hasArrow label="View client answers">
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
										</Tooltip>

										<Tooltip hasArrow label="View created bids">
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
										</Tooltip>

										<Tooltip hasArrow label="View tender offers">
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
										</Tooltip>

										<Tooltip hasArrow label="View offers I have submitted">
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
										</Tooltip>

										<Tooltip hasArrow label="View bidder tenders">
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
										</Tooltip>
									</HStack>
								</Box>
							</Flex>
							<Spacer />
							<Box>
								{showCreateBidButton ? (
									<Button
										colorScheme={'gray'}
										variant={'outline'}
										onClick={() =>
											setModalContext({ addBid: { bid: undefined } })
										}
									>
										Create bid
									</Button>
								) : null}
							</Box>
						</Flex>
					</DisabledComponent>
				}
			>
				<DisabledPage>
					<VStack style={{ height: '100%' }}>
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Container>
								<Outlet />
							</Container>
						</HStack>
					</VStack>
				</DisabledPage>
			</Page>
		</>
	);
};

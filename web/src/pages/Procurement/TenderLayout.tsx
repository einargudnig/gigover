import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { NewTenderCreate } from './tabs/NewTenderCreate';

export function TenderLayout() {
	const [showSearch, setShowSearch] = useState(false);
	const [showCreateTender, setShowCreateTender] = useState(false);

	const { data } = useUserTenders();

	return (
		<Page
			title={'Procurement'}
			contentPadding={false}
			actions={
				<DisabledComponent>
					<Flex>
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

						<Button onClick={() => setShowCreateTender(true)} ml={1}>
							New Tender
						</Button>
					</Flex>
				</DisabledComponent>
			}
			extraNav={
				<DisabledComponent>
					<>
						{!showCreateTender ? (
							<Flex
								borderBottom={'1px'}
								backgroundColor={'white'}
								borderColor={'gray.400'}
								width={'100%'}
							>
								<Box width={'100%'} mt={2}>
									<Flex justify={'space-around'}>
										<NavLink to={'/tender'} end>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Tender
												</Box>
											)}
										</NavLink>

										<NavLink to={'tender-offers'}>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													width={'100%'}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Offers Received
												</Box>
											)}
										</NavLink>

										<NavLink to={'invitations'}>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Tender Invitations
												</Box>
											)}
										</NavLink>

										<NavLink to={'my-offers'}>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Submitted Offers
												</Box>
											)}
										</NavLink>

										<NavLink to={'bids'}>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Create Bid
												</Box>
											)}
										</NavLink>
										<NavLink to={'bid-responses'}>
											{({ isActive }) => (
												<Box
													as="button"
													borderBottom={isActive ? '2px' : 'hidden	'}
													borderColor={'gray.600'}
													p={1}
													_hover={{
														borderBottom: '2px',
														borderColor: 'gray.300'
													}}
												>
													Bids Received
												</Box>
											)}
										</NavLink>
									</Flex>
								</Box>
							</Flex>
						) : (
							<Flex
								justifyContent={'end'}
								borderBottom={'1px'}
								backgroundColor={'white'}
								borderColor={'gray.400'}
								width={'100%'}
							>
								<Button
									variant="link"
									colorScheme="gray"
									onClick={() => setShowCreateTender(false)}
									mr={6}
									mt={2}
								>
									Show tender list
								</Button>
							</Flex>
						)}
					</>
				</DisabledComponent>
			}
		>
			<>
				{showCreateTender ? (
					<NewTenderCreate setShowCreateTender={setShowCreateTender} />
				) : (
					<>
						<Box>{<Outlet />}</Box>
					</>
				)}
			</>
		</Page>
	);
}

import { SearchIcon } from '@chakra-ui/icons';
import { IconButton, Button, Box, Tabs, Tab, TabList, Tooltip, Flex } from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { useState } from 'react';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { NavLink, Outlet } from 'react-router-dom';

export function NewTenderLayout() {
	const [showSearch, setShowSearch] = useState(false);
	const [showCreateTender, setShowCreateTender] = useState(false);

	const { data } = useUserTenders();

	return (
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

					<Button onClick={() => setShowCreateTender(true)}>New Tender</Button>
				</DisabledComponent>
			}
		>
			<Box>
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
								Tender Invitations
							</Box>
						)}
					</NavLink>
					<NavLink to={'/tender'} end>
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
								Sumbitted Offers
							</Box>
						)}
					</NavLink>
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
								Bids Received
							</Box>
						)}
					</NavLink>
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
								Create Bid
							</Box>
						)}
					</NavLink>
				</Flex>
			</Box>
			<Box>{<Outlet />}</Box>
		</Page>
	);
}

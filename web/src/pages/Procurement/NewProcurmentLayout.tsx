import { SearchIcon } from '@chakra-ui/icons';
import {
	IconButton,
	Button,
	Box,
	Tabs,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tooltip
} from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { useContext, useState } from 'react';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { ModalContext } from '../../context/ModalContext';
import { NewTenderCreate } from './tabs/NewTenderCreate';

export function NewProcurmentLayout() {
	const [, setModalContext] = useContext(ModalContext);
	const [showSearch, setShowSearch] = useState(false);

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

					<Button onClick={() => setModalContext({ addTender: { tender: undefined } })}>
						New Tender
					</Button>
				</DisabledComponent>
			}
		>
			<Box>
				<Tabs isFitted size="lg" align="center" colorScheme="blackAlpha">
					<TabList>
						<Tab>Tenders</Tab>
						<Tab>Tender Invitations</Tab>
						<Tab>Offers Received</Tab>
						<Tab>Submitted Offers</Tab>
						<Tab>Bids Received</Tab>
						<Tab>Create Bid</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<NewTenderCreate />
						</TabPanel>
						<TabPanel>
							<p>two!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>

						<TabPanel>
							<p>four!</p>
						</TabPanel>

						<TabPanel>
							<p>five!</p>
						</TabPanel>

						<TabPanel>
							<p>six!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Page>
	);
}

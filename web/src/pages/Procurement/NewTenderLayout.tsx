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
	Tooltip,
	Flex
} from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { useState } from 'react';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { NewTenderCreate } from './tabs/NewTenderCreate';
import { ProcurementHome } from './ProcurementHome';
import { BidderTenders } from './Offers/BidderTenders';
import { OfferForTenders } from './Offers/components/OfferForTenders';
import { BidderOffers } from './Offers/BidderOffers';
import { ClientAnswers } from './ClientBids/components/ClientAnswers';
import { Bids } from './ClientBids/components/Bids';
import { Outlet } from 'react-router-dom';

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
				<Tabs isFitted size="lg" align="center" colorScheme="blackAlpha">
					<TabList>
						<Tab>Tenders</Tab>
						<Tab>Tender Invitations</Tab>
						<Tab>Offers Received</Tab>
						<Tab>Submitted Offers</Tab>
						<Tab>Bids Received</Tab>
						<Tab>Create Bid</Tab>
					</TabList>
				</Tabs>
				<Flex>
					<Button>Tender</Button>
					<Button>Tender Invitations</Button>
					<Button>Offers Received</Button>
					<Button>Submitted Offers</Button>
					<Button>Bids Received</Button>
					<Button>Create Bid</Button>
				</Flex>
			</Box>
			<Box>{<Outlet />}</Box>
		</Page>
	);
}

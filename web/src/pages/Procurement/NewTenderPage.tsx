import { SearchIcon } from '@chakra-ui/icons';
import {
	IconButton,
	Box,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Tooltip
} from '@chakra-ui/react';
import { Page } from '../../components/Page';

import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { BidderOffers } from './Offers/BidderOffers';
import { BidderTenders } from './Offers/BidderTenders';
import { OfferForTenders } from './Offers/components/OfferForTenders';
import { ProcurementHome } from './ProcurementHome';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { NewTenderCreate } from './tabs/NewTenderCreate';
import { useState } from 'react';

export function NewTenderPage() {
	const [showSearch, setShowSearch] = useState(false);
	return (
		<Page
			title={'Procurement'}
			contentPadding={false}
			actions={
				<DisabledComponent>
					<Tooltip hasArrow label="Search tender">
						<IconButton
							variant={'outline'}
							aria-label={'Search'}
							colorScheme={'gray'}
							icon={<SearchIcon color={'black'} />}
							onClick={() => setShowSearch((v) => !v)}
						/>
					</Tooltip>
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
						<Tab>Create Bid</Tab>,
					</TabList>
					<TabPanels>
						<TabPanel>
							<p>Tender tabs</p>
						</TabPanel>
						<TabPanel>
							<BidderTenders />
						</TabPanel>
						<TabPanel>
							<OfferForTenders />
						</TabPanel>
						<TabPanel>
							<BidderOffers />
						</TabPanel>
						<TabPanel>{/* <BidsReceived /> */}</TabPanel>
						<TabPanel>{/* <CreateBid /> */}</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Page>
	);
}

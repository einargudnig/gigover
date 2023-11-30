import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Organize } from './pages/Organize';
import { TimeTracker } from './pages/TimeTracker/TimeTracker';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { ProjectDetails } from './pages/ProjectDetails/ProjectDetails';
import { RoadmapPreloader } from './pages/Roadmap/RoadmapPreloader';
import { Files } from './pages/Files/Files';
import { Resources } from './pages/Resources/Resources';
import { FolderFolder } from './pages/Files/new/FolderFolder';
import { FilesHome } from './pages/Files/new/FilesHome';
import { ProjectFolder } from './pages/Files/new/ProjectFolder';
import { TenderFolder } from './pages/Files/new/TenderFolder';
import { TenderFolderHome } from './pages/Files/new/TenderFolderHome';
import { OffersFolder } from './pages/Files/new/components/OffersFolder';
import { OfferFile } from './pages/Files/new/components/OfferFile';
import { TendersFolder } from './pages/Files/new/components/TendersFolder';
import { TenderFile } from './pages/Files/new/components/TenderFile';
// Procurement/Tenders/Offers
import { ProcurementHome } from './pages/Procurement/ProcurementHome';
import { Procurement } from './pages/Procurement/Procurement';
import { TenderPage } from './pages/Procurement/components/Tender';
import { TenderOffer } from './pages/Procurement/Offers/components/TenderOffer';
import { TenderOfferHome } from './pages/Procurement/Offers/components/TenderOfferHome';
import { BidderOffers } from './pages/Procurement/Offers/BidderOffers';
import { OfferForTenders } from './pages/Procurement/Offers/components/OfferForTenders';
import { OfferForTender } from './pages/Procurement/Offers/components/OfferForTender';
import { BidderTenders } from './pages/Procurement/Offers/BidderTenders';
import { PublishedTender } from './pages/Procurement/Offers/components/PublishedTender';
import { OfferPublished } from './pages/Procurement/Offers/components/OfferPublished';
import { CreateBid } from './pages/Procurement/ClientBids/CreateBid';
import { ClientAnswer } from './pages/Procurement/ClientBids/ClientAnswer';

export const AuthenticatedRoutes = (): JSX.Element => (
	<Routes>
		<Route path={'/'} element={<Dashboard />} />
		<Route path={'project/:projectId'} element={<ProjectDetails />}>
			<Route path={':taskId'} element={<Organize />} />
		</Route>
		<Route path={'roadmap'} element={<RoadmapPreloader />} />
		<Route path={'files'} element={<Files />}>
			<Route index element={<FilesHome />} />
			{/*			<Route path={':projectId/file/:fileId'} element={<FileId />} />
			<Route path={':projectId/file/:folderId/:fileId'} element={<FileId />} />*/}
			<Route path={':projectId'} element={<ProjectFolder />} />
			<Route path={':projectId/folder/:folderId/:fileId'} element={<FolderFolder />} />
			<Route path={':projectId/folder/:folderId'} element={<FolderFolder />} />
			<Route path={':projectId/:fileId'} element={<ProjectFolder />} />
			{/* This route is for documents for all tenders and offers */}
			<Route path={'tender'} element={<TenderFolder />}>
				<Route index element={<TenderFolderHome />} />
				<Route path={'tenders'} element={<TendersFolder />} />
				<Route path={'tenders/:tenderId'} element={<TenderFile />} />
				{/* <Route path={'tenders/:tenderId/:fileId'} element={<TenderFile />} /> */}
				<Route path={'offers'} element={<OffersFolder />} />
				<Route path={'offers/:offerId'} element={<OfferFile />} />
				<Route path={'offers/:offerId/:fileId'} element={<OfferFile />} />
			</Route>
		</Route>
		<Route path={'organize'} element={<Organize />}>
			<Route path={':projectId'} element={<Organize />} />
		</Route>
		<Route path={'time-tracker'} element={<TimeTracker />}>
			<Route path={':projectId'} element={<TimeTracker />} />
		</Route>
		<Route path={'users'} element={<Users />}>
			<Route path={':userId'} element={<Users />} />
		</Route>

		{/* This is going to be 'bigger' and more complicated with the new changes
				/tender is the parent route for the whole tender system.
		*/}
		<Route path={'tender'} element={<Procurement />}>
			<Route index element={<ProcurementHome />} />
			<Route path={':tenderId'} element={<TenderPage />} />
			<Route path={'client-answer'} element={<ClientAnswer />} />
			<Route path={'create-bid'} element={<CreateBid />} />
			<Route path={'tender-offers'} element={<OfferForTenders />}>
				<Route path={':tenderId'} element={<OfferForTender />} />
				{/* This route should show us a table with items that have had a published offer. */}
				<Route path={':tenderId/:offerId'} element={<PublishedTender />} />
			</Route>
			<Route path={'bidder-offers'} element={<BidderOffers />} />
			<Route path={'bidder-tenders'} element={<BidderTenders />} />
			{/* This is the page that the bidder sees, where he can open the offer */}
			<Route path={'offers/:tenderId'} element={<TenderOfferHome />} />
			{/* The page where the user is sent after he opens the offer */}
			<Route path={'offers/:tenderId/:offerId'} element={<TenderOffer />} />
			{/* This is a different page, the bidder can see his published bid*/}
			<Route path={'published-offer/:tenderId/:offerId'} element={<OfferPublished />} />
		</Route>

		<Route path={'settings'} element={<Settings />} />
		<Route path={'resources'} element={<Resources />} />
		<Route path={'project'} element={<Dashboard />}>
			<Route path={':id'} element={<Dashboard />} />
		</Route>
	</Routes>
);

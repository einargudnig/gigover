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
import { CreateBidOutlet } from './pages/Procurement/ClientBids/CreateBidOutlet';
import { Bids } from './pages/Procurement/ClientBids/components/Bids';
import { BidId } from './pages/Procurement/ClientBids/components/BidId';
import { ClientAnswers } from './pages/Procurement/ClientBids/components/ClientAnswers';
import { ClientAnswerId } from './pages/Procurement/ClientBids/components/ClientAnswerId';
import { Property } from './pages/Property/Property';
import { PropertyId } from './pages/Property/PropertyId';
import { PropertyOutlet } from './pages/Property/PropertyOutlet';
import { ClientAnswerOutlet } from './pages/Procurement/ClientBids/ClientAnswerOutlet';

export const AuthenticatedRoutes = (): JSX.Element => (
	<Routes>
		<Route path={'/'} element={<Dashboard />} />

		{/* 📝 Tasks 📝 */}
		<Route path={'project/:projectId'} element={<ProjectDetails />}>
			<Route path={':taskId'} element={<Organize />} />
		</Route>

		{/* 🏘️ Property system 🏘️ */}
		<Route path={'property'} element={<PropertyOutlet />}>
			<Route index element={<Property />} />
			<Route path={':propertyId'} element={<PropertyId />} />
		</Route>

		{/* 🛣️ Roadmap 🛣️ */}
		<Route path={'roadmap'} element={<RoadmapPreloader />} />

		{/* 📂 File System 📂 */}
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

		{/* 💰 Tender/Offer  system 💰 */}
		<Route path={'tender'} element={<Procurement />}>
			<Route index element={<ProcurementHome />} />
			<Route path={':tenderId'} element={<TenderPage />} />
			{/* Client-answer */}
			<Route path={'client-answer'} element={<ClientAnswerOutlet />}>
				<Route index element={<ClientAnswers />} />
				<Route path={':clientBidId'} element={<ClientAnswerId />} />
			</Route>
			{/* Client-bid */}
			<Route path={'create-bid'} element={<CreateBidOutlet />}>
				<Route index element={<Bids />} />
				<Route path={':clientBidId'} element={<BidId />} />
			</Route>
			<Route path={'tender-offers'} element={<OfferForTenders />} />
			<Route path={'tender-offer/:tenderId'} element={<OfferForTender />} />
			<Route path={'tender-offer/:tenderId/:offerId'} element={<PublishedTender />} />
			<Route path={'bidder-offers'} element={<BidderOffers />} />
			<Route path={'bidder-tenders'} element={<BidderTenders />} />
			{/* This is the page that the bidder sees, where he can open the offer */}
			<Route path={'offers/:tenderId'} element={<TenderOfferHome />} />
			{/* The page where the user is sent after he opens the offer */}
			<Route path={'offers/:tenderId/:offerId'} element={<TenderOffer />} />
			{/* This is a different page, the bidder can see his published bid*/}
			<Route path={'published-offer/:tenderId/:offerId'} element={<OfferPublished />} />
		</Route>

		{/* 🛠️ Settings 🛠️ */}
		<Route path={'settings'} element={<Settings />} />

		{/* 🏎️ Resources 🏎️ */}
		<Route path={'resources'} element={<Resources />} />

		<Route path={'project'} element={<Dashboard />}>
			<Route path={':id'} element={<Dashboard />} />
		</Route>
	</Routes>
);

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
// Procurement/Tenders/Offers
import { ProcurementHome } from './pages/Procurement/ProcurementHome';
import { Procurement } from './pages/Procurement/Procurement';
import { Tender } from './pages/Procurement/components/Tender';
import { TenderOffer } from './pages/Procurement/Offers/components/TenderOffer';
import { TenderOfferHome } from './pages/Procurement/Offers/components/TenderOfferHome';
import { BidderOffers } from './pages/Procurement/Offers/BidderOffers';
import { Offers } from './pages/Procurement/Offers/Offers';
import { OfferForTenders } from './pages/Procurement/Offers/components/OfferForTenders';
import { OfferForTender } from './pages/Procurement/Offers/components/OfferForTender';
import { BidderTenders } from './pages/Procurement/Offers/BidderTenders';
import { PublishedTender } from './pages/Procurement/Offers/components/PublishedTender';

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

		<Route path={'tender'} element={<Procurement />}>
			<Route index element={<ProcurementHome />} />
			<Route path={':tenderId'} element={<Tender />} />
			<Route path={'offers/:tenderId'} element={<TenderOfferHome />} />
			<Route path={'offers/:tenderId/:offerId'} element={<TenderOffer />} />
		</Route>

		{/* This route will be for the user that makes offers */}
		<Route path={'bidder-tenders'} element={<BidderTenders />} />
		<Route path={'bidder-offers'} element={<BidderOffers />} />

		{/*
			 The first route is accessible from the ProcurementHome page.
			 The second one from the Procurement/id page
		*/}
		<Route path={'tender-offers'} element={<Offers />}>
			<Route index element={<OfferForTenders />} />
			<Route path={':tenderId'} element={<OfferForTender />} />
			{/* This route should show us a table with items that have had a published offer. */}
			<Route path={':tenderId/:offerId'} element={<PublishedTender />} />
		</Route>

		<Route path={'settings'} element={<Settings />} />
		<Route path={'resources'} element={<Resources />} />
		<Route path={'project'} element={<Dashboard />}>
			<Route path={':id'} element={<Dashboard />} />
		</Route>
	</Routes>
);

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
// import { Tenders } from './pages/Procurement/components/Tenders';
import { Tender } from './pages/Procurement/components/Tender';
import { TenderOffer } from './pages/Procurement/Offers/TenderOffer';
import { UserOffers } from './pages/Procurement/Offers/UserOffers';
import { OfferForTenders } from './pages/Procurement/Offers/OfferForTenders';
import { OfferForTender } from './pages/Procurement/Offers/OfferForTender';

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
		{/* This procurement route should be protected. */}
		<Route path={'procurement'} element={<Procurement />}>
			<Route index element={<ProcurementHome />} />
			<Route path={':tenderId'} element={<Tender />} />
			<Route path={'offers/:tenderId'} element={<TenderOffer />} />
		</Route>

		{/* This route will be for the user that makes offers */}
		<Route path={'user-offers'} element={<UserOffers />} />

		{/* This route will be for offers for certain tenderId */}
		{/* For the time being this will be an outlet.
		   I might make a list there with all tenders and logic to navigate to the offer page for that tender
		*/}
		<Route path={'tender-offers'} element={<OfferForTenders />}>
			<Route path={':tenderId'} element={<OfferForTender />} />
		</Route>

		<Route path={'settings'} element={<Settings />} />
		<Route path={'resources'} element={<Resources />} />
		<Route path={'project'} element={<Dashboard />}>
			<Route path={':id'} element={<Dashboard />} />
		</Route>
	</Routes>
);

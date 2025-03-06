import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Files } from './pages/Files/Files';
import { FilesHome } from './pages/Files/new/FilesHome';
import { FolderFolder } from './pages/Files/new/FolderFolder';
import { ProjectFolder } from './pages/Files/new/ProjectFolder';
import { TenderFolder } from './pages/Files/new/TenderFolder';
import { TenderFolderHome } from './pages/Files/new/TenderFolderHome';
import { OfferFile } from './pages/Files/new/components/OfferFile';
import { OffersFolder } from './pages/Files/new/components/OffersFolder';
import { TenderFile } from './pages/Files/new/components/TenderFile';
import { TendersFolder } from './pages/Files/new/components/TendersFolder';
import { Onboarding } from './pages/Onboarding';
import { Organize } from './pages/Organize';
import { ProjectDetails } from './pages/ProjectDetails/ProjectDetails';
import { Resources } from './pages/Resources/Resources';
import { RoadmapPreloader } from './pages/Roadmap/RoadmapPreloader';
import { Settings } from './pages/Settings';
import { TimeTracker } from './pages/TimeTracker/TimeTracker';
import { Users } from './pages/Users';
// Procurement/Tenders/Offers
import { BidResponsesOutlet } from './pages/Procurement/ClientBids/BidResponsesOutlet';
import { BidsOutlet } from './pages/Procurement/ClientBids/BidsOutlet';
import { BidDetails } from './pages/Procurement/ClientBids/components/BidDetails';
import { BidsList } from './pages/Procurement/ClientBids/components/BidsList';
import { BidResponseDetails } from './pages/Procurement/ClientBids/components/BidResponseDetails';
import { BidResponsesList } from './pages/Procurement/ClientBids/components/BidResponsesList';
import { TenderLayout } from './pages/Procurement/TenderLayout';
import { MyOffersList } from './pages/Procurement/Offers/MyOffersList';
import { InvitedTendersList } from './pages/Procurement/Offers/InvitedTendersList';
import { TenderOfferDetails } from './pages/Procurement/Offers/components/TenderOfferDetails';
import { TenderOffersList } from './pages/Procurement/Offers/components/TendersOffersList';
import { MyOffersDetails } from './pages/Procurement/Offers/components/MyOfferDetails';
import { TenderOfferAnswer } from './pages/Procurement/Offers/components/TenderOfferAnswer';
import { InvitedTendersDetails } from './pages/Procurement/Offers/components/InvitedTendersDetails';
import { TenderDetails } from './pages/Procurement/components/TenderDetails';
import { MyTendersList } from './pages/Procurement/tabs/MyTendersList';
import { ProjectDetailsFiles } from './pages/ProjectDetails/ProjectDetailsFiles';
import { ProjectDetailsGanttChart } from './pages/ProjectDetails/ProjectDetailsGanttChart';
import { ProjectDetailsOutlet } from './pages/ProjectDetails/ProjectDetailsOutlet';
import { Property } from './pages/Property/Property';
import { PropertyId } from './pages/Property/PropertyId';
import { PropertyOutlet } from './pages/Property/PropertyOutlet';

export const AuthenticatedRoutes = (): JSX.Element => (
	<Routes>
		{/* <Route path={'/'} element={<Dashboard />} /> */}
		<Route path={'/'} element={<Dashboard />} />

		{/* Onboarding user -> only accessible when userProfile has registered = false */}
		<Route path={'onboarding'} element={<Onboarding />} />

		{/* 📝 Tasks 📝 */}
		{/* This should also become an Outlet route */}
		{/* Outlet route for all things related to this project */}
		{/* Tasks, Gantt Chart and Files! */}
		<Route path={'project/:projectId'} element={<ProjectDetailsOutlet />}>
			<Route index element={<ProjectDetails />} />
			<Route path={'gantt'} element={<ProjectDetailsGanttChart />} />
			<Route path={'files'} element={<ProjectDetailsFiles />} />
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
		<Route path={'tender'} element={<TenderLayout />}>
			{/* Tenders created by the user */}
			<Route index element={<MyTendersList />} />
			<Route path={':tenderId'} element={<TenderDetails />} />
			<Route path={'tender-offers'} element={<TenderOffersList />} />
			<Route path={'tender-offer/:tenderId'} element={<TenderOfferDetails />} />
			{/* Submitted offer to my tenders, here I can answer them!*/}
			<Route path={'tender-offer/:tenderId/:offerId'} element={<TenderOfferAnswer />} />

			{/* User has been invited to add offers to these tenders */}
			<Route path={'invitations'} element={<InvitedTendersList />} />
			<Route path={'invitations/:tenderId'} element={<InvitedTendersDetails />} />

			{/* Offers that you have submitted */}
			<Route path={'my-offers'} element={<MyOffersList />} />
			<Route path={'my-offer/:tenderId/:offerId'} element={<MyOffersDetails />} />

			{/*  Creating bid without inviting many bidders*/}
			<Route path={'bids'} element={<BidsOutlet />}>
				<Route index element={<BidsList />} />
				<Route path={':bidId'} element={<BidDetails />} />
			</Route>

			{/* Answsers to the bids that you created */}
			<Route path={'bid-responses'} element={<BidResponsesOutlet />}>
				<Route index element={<BidResponsesList />} />
				<Route path={':bidId'} element={<BidResponseDetails />} />
			</Route>
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

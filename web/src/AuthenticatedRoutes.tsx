import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page } from './components/Page';

const LazyDashboard = lazy(() =>
	import('./pages/Dashboard/Dashboard').then((module) => ({ default: module.Dashboard }))
);
const LazyFiles = lazy(() =>
	import('./pages/Files/Files').then((module) => ({ default: module.Files }))
);
const LazyFilesHome = lazy(() =>
	import('./pages/Files/new/FilesHome').then((module) => ({ default: module.FilesHome }))
);
const LazyFolderFolder = lazy(() =>
	import('./pages/Files/new/FolderFolder').then((module) => ({ default: module.FolderFolder }))
);
const LazyProjectFolder = lazy(() =>
	import('./pages/Files/new/ProjectFolder').then((module) => ({ default: module.ProjectFolder }))
);
const LazyTenderFolderHome = lazy(() =>
	import('./pages/Files/new/TenderFolderHome').then((module) => ({
		default: module.TenderFolderHome
	}))
);
const LazyTenderFolder = lazy(() =>
	import('./pages/Files/new/TenderFolderOutlet').then((module) => ({
		default: module.TenderFolder
	}))
);
const LazyOfferFiles = lazy(() =>
	import('./pages/Files/new/components/OfferFiles').then((module) => ({
		default: module.OfferFiles
	}))
);
const LazyOffersFolder = lazy(() =>
	import('./pages/Files/new/components/OffersFolder').then((module) => ({
		default: module.OffersFolder
	}))
);
const LazyTenderFile = lazy(() =>
	import('./pages/Files/new/components/TenderFile').then((module) => ({
		default: module.TenderFile
	}))
);
const LazyTendersFolder = lazy(() =>
	import('./pages/Files/new/components/TendersFolder').then((module) => ({
		default: module.TendersFolder
	}))
);
const LazyOnboarding = lazy(() =>
	import('./pages/Onboarding').then((module) => ({ default: module.Onboarding }))
);
const LazyOrganize = lazy(() =>
	import('./pages/Organize').then((module) => ({ default: module.Organize }))
);
const LazyProjectDetails = lazy(() =>
	import('./pages/ProjectDetails/ProjectDetails').then((module) => ({
		default: module.ProjectDetails
	}))
);
const LazyProjectDetailsGanttChart = lazy(() =>
	import('./pages/ProjectDetails/ProjectDetailsGanttChart').then((module) => ({
		default: module.ProjectDetailsGanttChart
	}))
);
const LazyProjectDetailsFiles = lazy(() =>
	import('./pages/ProjectDetails/ProjectDetailsFiles').then((module) => ({
		default: module.ProjectDetailsFiles
	}))
);
const LazyProjectDetailsOutlet = lazy(() =>
	import('./pages/ProjectDetails/ProjectDetailsOutlet').then((module) => ({
		default: module.ProjectDetailsOutlet
	}))
);
const LazyPropertyOutlet = lazy(() =>
	import('./pages/Property/PropertyOutlet').then((module) => ({ default: module.PropertyOutlet }))
);
const LazyProperty = lazy(() =>
	import('./pages/Property/Property').then((module) => ({ default: module.Property }))
);
const LazyPropertyId = lazy(() =>
	import('./pages/Property/PropertyId').then((module) => ({ default: module.PropertyId }))
);
const LazyRoadmapPreloader = lazy(() =>
	import('./pages/Roadmap/RoadmapPreloader').then((module) => ({
		default: module.RoadmapPreloader
	}))
);
const LazySettings = lazy(() =>
	import('./pages/Settings').then((module) => ({ default: module.Settings }))
);
const LazyResources = lazy(() =>
	import('./pages/Resources/Resources').then((module) => ({ default: module.Resources }))
);
const LazyTimeTracker = lazy(() =>
	import('./pages/TimeTracker/TimeTracker').then((module) => ({ default: module.TimeTracker }))
);
const LazyUsers = lazy(() => import('./pages/Users').then((module) => ({ default: module.Users })));
const LazyBidDetails = lazy(() =>
	import('./pages/Procurement/ClientBids/components/BidDetails').then((module) => ({
		default: module.BidDetails
	}))
);
const LazyBidResponseDetails = lazy(() =>
	import('./pages/Procurement/ClientBids/components/BidResponseDetails').then((module) => ({
		default: module.BidResponseDetails
	}))
);
const LazyBidResponsesList = lazy(() =>
	import('./pages/Procurement/ClientBids/components/BidResponsesList').then((module) => ({
		default: module.BidResponsesList
	}))
);
const LazyBidsList = lazy(() =>
	import('./pages/Procurement/ClientBids/components/BidsList').then((module) => ({
		default: module.BidsList
	}))
);
const LazyInvitedTendersList = lazy(() =>
	import('./pages/Procurement/Offers/InvitedTendersList').then((module) => ({
		default: module.InvitedTendersList
	}))
);
const LazyMyOffersList = lazy(() =>
	import('./pages/Procurement/Offers/MyOffersList').then((module) => ({
		default: module.MyOffersList
	}))
);
const LazyInvitedTendersDetails = lazy(() =>
	import('./pages/Procurement/Offers/components/InvitedTendersDetails').then((module) => ({
		default: module.InvitedTendersDetails
	}))
);
const LazyMyOffersDetails = lazy(() =>
	import('./pages/Procurement/Offers/components/MyOfferDetails').then((module) => ({
		default: module.MyOffersDetails
	}))
);
const LazyTenderOfferAnswer = lazy(() =>
	import('./pages/Procurement/Offers/components/TenderOfferAnswer').then((module) => ({
		default: module.TenderOfferAnswer
	}))
);
const LazyTenderOfferDetails = lazy(() =>
	import('./pages/Procurement/Offers/components/TenderOfferDetails').then((module) => ({
		default: module.TenderOfferDetails
	}))
);
const LazyTenderOffersList = lazy(() =>
	import('./pages/Procurement/Offers/components/TendersOffersList').then((module) => ({
		default: module.TenderOffersList
	}))
);
const LazyTenderLayout = lazy(() =>
	import('./pages/Procurement/TenderLayout').then((module) => ({ default: module.TenderLayout }))
);
const LazyTenderDetails = lazy(() =>
	import('./pages/Procurement/components/TenderDetails').then((module) => ({
		default: module.TenderDetails
	}))
);
const LazyMyTendersList = lazy(() =>
	import('./pages/Procurement/tabs/MyTendersList').then((module) => ({
		default: module.MyTendersList
	}))
);

export const AuthenticatedRoutes = (): JSX.Element => (
	<Routes>
		<Route path={'/'} element={<Page />}>
			{/* Onboarding user -> only accessible when userProfile has registered = false */}
			<Route index element={<LazyDashboard />} />

			{/* 📝 Tasks 📝 */}
			<Route path={'project/:projectId'} element={<LazyProjectDetailsOutlet />}>
				<Route index element={<LazyProjectDetails />} />
				<Route path={'gantt'} element={<LazyProjectDetailsGanttChart />} />
				<Route path={'files'} element={<LazyProjectDetailsFiles />} />
				<Route path={':taskId'} element={<LazyOrganize />} />
			</Route>

			{/* 🏘️ Property system 🏘️ */}
			<Route path={'property'} element={<LazyPropertyOutlet />}>
				<Route index element={<LazyProperty />} />
				<Route path={':propertyId'} element={<LazyPropertyId />} />
			</Route>

			{/* 🛣️ Roadmap 🛣️ */}
			<Route path={'roadmap'} element={<LazyRoadmapPreloader />} />

			{/* 📂 File System 📂 */}
			<Route path={'files'} element={<LazyFiles />}>
				<Route index element={<LazyFilesHome />} />
				<Route path={':projectId'} element={<LazyProjectFolder />} />
				<Route
					path={':projectId/folder/:folderId/:fileId'}
					element={<LazyFolderFolder />}
				/>
				<Route path={':projectId/folder/:folderId'} element={<LazyFolderFolder />} />
				<Route path={':projectId/:fileId'} element={<LazyProjectFolder />} />
				{/* This route is for documents for all tenders and offers */}
				<Route path={'tender'} element={<LazyTenderFolder />}>
					<Route index element={<LazyTenderFolderHome />} />
					<Route path={'tenders'} element={<LazyTendersFolder />} />
					<Route path={'tenders/:tenderId'} element={<LazyTenderFile />} />
					<Route path={'offers'} element={<LazyOffersFolder />} />
					<Route path={'offers/:offerId'} element={<LazyOfferFiles />} />
					<Route path={'offers/:offerId/:fileId'} element={<LazyOfferFiles />} />
				</Route>
			</Route>

			<Route path={'organize'} element={<LazyOrganize />}>
				<Route path={':projectId'} element={<LazyOrganize />} />
			</Route>

			<Route path={'time-tracker'} element={<LazyTimeTracker />}>
				<Route path={':projectId'} element={<LazyTimeTracker />} />
			</Route>

			<Route path={'users'} element={<LazyUsers />}>
				<Route path={':userId'} element={<LazyUsers />} />
			</Route>

			{/* 💰 Tender/Offer  system 💰 */}
			<Route path={'tender'} element={<LazyTenderLayout />}>
				{/* Tenders created by the user */}
				<Route index element={<LazyMyTendersList />} />
				<Route path={':tenderId'} element={<LazyTenderDetails />} />
				<Route path={'tender-offers'} element={<LazyTenderOffersList />} />
				<Route path={'tender-offer/:tenderId'} element={<LazyTenderOfferDetails />} />
				{/* Submitted offer to my tenders, here I can answer them!*/}
				<Route
					path={'tender-offer/:tenderId/:offerId'}
					element={<LazyTenderOfferAnswer />}
				/>

				{/* User has been invited to add offers to these tenders */}
				<Route path={'invitations'} element={<LazyInvitedTendersList />} />
				<Route path={'invitations/:tenderId'} element={<LazyInvitedTendersDetails />} />

				{/* Offers that you have submitted */}
				<Route path={'my-offers'} element={<LazyMyOffersList />} />
				<Route path={'my-offer/:tenderId/:offerId'} element={<LazyMyOffersDetails />} />

				{/*  Creating bid without inviting many bidders*/}
				<Route path={'bids'} element={<LazyBidsList />} />
				<Route path={'bids/:bidId'} element={<LazyBidDetails />} />

				{/* Answers to the bids that you created */}
				<Route path={'bid-responses'} element={<LazyBidResponsesList />} />
				<Route path={'bid-responses/:bidId'} element={<LazyBidResponseDetails />} />
			</Route>

			{/* 🛠️ Settings 🛠️ */}
			<Route path={'settings'} element={<LazySettings />} />

			{/* 🏎️ Resources 🏎️ */}
			<Route path={'resources'} element={<LazyResources />} />

			<Route path={'project'} element={<LazyDashboard />}>
				<Route path={':id'} element={<LazyDashboard />} />
			</Route>
		</Route>

		<Route path={'onboarding'} element={<LazyOnboarding />} />
	</Routes>
);

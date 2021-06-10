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

export const AuthenticatedRoutes = (): JSX.Element => (
	<Routes>
		<Route path={'/'} element={<Dashboard />} />
		<Route path={'project/:projectId'} element={<ProjectDetails />}>
			<Route path={':taskId'} element={<Organize />} />
		</Route>
		<Route path={'roadmap'} element={<RoadmapPreloader />} />
		<Route path={'files'}>
			<Route path={':projectId/file/:fileId'} element={<Files />} />
			<Route path={':projectId'} element={<Files />} />
			<Route path={':projectId/:folderId'} element={<Files />} />
			<Route path={'/'} element={<Files />} />
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
		<Route path={'settings'} element={<Settings />} />
		<Route path={'project'} element={<Dashboard />}>
			<Route path={':id'} element={<Dashboard />} />
		</Route>
	</Routes>
);

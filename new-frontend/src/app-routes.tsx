import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout';
import { Landing } from './pages/landing';
import { Features } from './pages/features';
import { Pricing } from './pages/pricing';
import { BlogPosts } from './pages/blog-posts';
import { MobileApp } from './pages/mobile-app';
import { UserManual } from './pages/user-manual';

export const AppRoutes = (): JSX.Element => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Landing />} />
				<Route path="features" element={<Features />} />
				<Route path="pricing" element={<Pricing />} />
				<Route path="blog" element={<BlogPosts />}>
					<Route path=":id/:slug" element={<Blog />} />
				</Route>
				<Route path="mobile-app" element={<MobileApp />} />
				<Route path="user-manual" element={<UserManual />} />
				{/* catch-all route */}
				<Route path="*" element={<div>Nothing here!</div>} />
			</Route>
		</Routes>
	);
};

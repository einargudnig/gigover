import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout';
import { Landing } from './pages/landing';
import { Features } from './pages/features';
import { Pricing } from './pages/pricing';
import { BlogPosts } from './pages/blog-posts';
import { BlogPost } from './pages/blog-post';
import { MobileApp } from './pages/mobile-app';
import { UserManual } from './pages/user-manual';

export const AppRoutes = (): JSX.Element => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Landing />} />
				<Route path="features" element={<Features />} />
				<Route path="pricing" element={<Pricing />} />
				<Route path="blog" element={<BlogPosts />} />
				{/* This could be a sub route - but I have to add Outlet to make it work. Let's keep it like this for now! */}
				<Route path="blog/:id/:slug" element={<BlogPost />} />
				<Route path="mobile-app" element={<MobileApp />} />
				<Route path="user-manual" element={<UserManual />} />
				{/* catch-all route */}
				<Route path="*" element={<div>Nothing here!</div>} />
			</Route>
		</Routes>
	);
};

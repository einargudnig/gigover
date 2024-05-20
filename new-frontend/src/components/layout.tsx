import { Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { Navbar } from './navbar';
import { Footer } from './footer';

export const Layout = () => {
	return (
		<Flex direction={'column'} flex="1">
			<Navbar />
			<Flex
				flexGrow={1} // This will make the main content grow and take available space
				flexDirection={'column'}
				justifyContent="center"
				alignItems="center"
				as="main"
			>
				<Outlet />
			</Flex>
			<Footer />
		</Flex>
	);
};

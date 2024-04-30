import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { Navbar, MobileNavbar } from './navbar';
import { Footer } from './footer';

export const Layout = () => {
	return (
		<Flex direction={'column'} flex="1">
			<Navbar />
			{/* <MobileNavbar /> */}
			<Flex as="main" direction={'column'} flex="1" paddingX={'82px'}>
				<Outlet />
			</Flex>
			<Footer />
		</Flex>
	);
};

import { Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { Navbar } from './navbar';
import { Footer } from './footer';

export const Layout = () => {
	return (
		<Flex direction={'column'} flex="1">
			<Navbar />
			<Flex
				as="main"
				direction={'column'}
				flex="1"
				paddingX={['12px', '124px']}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Outlet />
			</Flex>
			<Footer />
		</Flex>
	);
};

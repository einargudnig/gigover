import {
	Flex,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Heading,
	HStack,
	VStack,
	Box,
	Text
} from '@chakra-ui/react';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { Link as RouterLink } from 'react-router-dom';

export function Settings() {
	const pageTitle = 'Settings';
	const breadcrumbs = [{ title: 'Settings', url: '/settings' }];

	return (
		<>
			<Box
				as="header"
				position="relative"
				zIndex={1}
				borderBottom="1px solid"
				borderColor="gray.200"
				boxShadow="6px 6px 25px rgba(0, 0, 0, 0.03)"
				bg="white"
				mb={4}
				px={3}
			>
				<Flex justifyContent="space-between" alignItems="center">
					<Box>
						{breadcrumbs ? (
							<Breadcrumb spacing="8px">
								{breadcrumbs.map((breadcrumb, bIndex) => (
									<BreadcrumbItem key={bIndex}>
										{breadcrumb.url ? (
											<BreadcrumbLink as={RouterLink} href={breadcrumb.url}>
												{breadcrumb.title}
											</BreadcrumbLink>
										) : (
											<Text as="span">{breadcrumb.title}</Text>
										)}
									</BreadcrumbItem>
								))}
							</Breadcrumb>
						) : (
							<Heading as="h1" size="lg" color="black">
								{pageTitle}
							</Heading>
						)}
					</Box>
				</Flex>
			</Box>
			<Box p={2}>
				<DisabledPage>
					<VStack style={{ height: '100%' }}>
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Box overflowY={'auto'} height={'100%'} width={'100%'}>
								Settings
							</Box>
						</HStack>
					</VStack>
				</DisabledPage>
			</Box>
		</>
	);
}

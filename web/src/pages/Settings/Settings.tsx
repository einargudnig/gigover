import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	HStack,
	Heading,
	Text,
	VStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { SettingsLayout } from './SettingsLayout';

export function Settings() {
	const pageTitle = 'Settings';
	const breadcrumbs = [{ title: 'Settings', url: '/settings' }];
	const pageActions = (
		<Box display={'flex'} gap={2} alignItems={'center'} py={2} height={'50px'}>
			<Button colorScheme={'yellow'}>Manage active organization</Button>
		</Box>
	);

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
				px={3}
			>
				<Flex justifyContent="space-between" alignItems="center">
					<Box mt={1}>
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
					<HStack spacing={2}>{pageActions}</HStack>
				</Flex>
			</Box>
			<Box p={2}>
				<DisabledPage>
					<VStack style={{ height: '100%' }}>
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Box overflowY={'auto'} height={'100%'} width={'100%'}>
								<SettingsLayout />
							</Box>
						</HStack>
					</VStack>
				</DisabledPage>
			</Box>
		</>
	);
}

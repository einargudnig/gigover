import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	HStack,
	Heading,
	IconButton,
	Link,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { ModalContext } from '../../context/ModalContext';
import { PropertySearchBar } from './components/PropertySearchBar';

export const PropertyOutlet = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [showSearch, setShowSearch] = useState(false);

	const pageTitle = 'Property';
	const breadcrumbs = [{ title: 'Property', url: '/property' }];
	const pageActions = (
		<DisabledComponent>
			<Box display={'flex'} gap={2} alignItems={'center'} py={2}>
				<Flex align="center">
					{showSearch ? (
						<PropertySearchBar setShowSearch={setShowSearch} />
					) : (
						<Tooltip hasArrow label={'Search for property'}>
							<IconButton
								variant={'outline'}
								aria-label={'Search'}
								colorScheme={'gray'}
								icon={<SearchIcon color={'black'} />}
								onClick={() => setShowSearch((v) => !v)}
							/>
						</Tooltip>
					)}
					<Button
						ml={3}
						onClick={() => setModalContext({ addProperty: { property: undefined } })}
					>
						New Property
					</Button>
				</Flex>
			</Box>
		</DisabledComponent>
	);

	return (
		<>
			<Box
				as="header"
				borderBottom="1px solid"
				borderColor="gray.200"
				boxShadow="6px 6px 25px rgba(0, 0, 0, 0.03)"
				bg="white" // Or transparent if Page.tsx sets a default bg for content
				mb={4} // Margin to separate from content
				px={3}
			>
				<Flex justifyContent="space-between" alignItems="center">
					<Box>
						{breadcrumbs ? (
							<Breadcrumb
								spacing="8px"
								// separator={<Chevron direction="right" color={Theme.colors.green} />}
							>
								{breadcrumbs.map((breadcrumb, bIndex) => (
									<BreadcrumbItem key={bIndex}>
										{breadcrumb.url ? (
											<BreadcrumbLink as={Link} to={breadcrumb.url}>
												{breadcrumb.title}
											</BreadcrumbLink>
										) : (
											<Text as="span">{breadcrumb.title}</Text> // For non-link breadcrumbs
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
								<Outlet />
							</Box>
						</HStack>
					</VStack>
				</DisabledPage>
			</Box>
		</>
	);
};

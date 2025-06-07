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
	Text,
	Tooltip
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { useUserTenders } from '../../queries/procurement/useUserTenders';
import { ProcurementSearchBar } from './ProcurementSearchBar';
import { NewTenderCreate } from './tabs/NewTenderCreate';

export function TenderLayout() {
	const [showSearch, setShowSearch] = useState(false);
	const [showCreateTender, setShowCreateTender] = useState(false);

	const { data } = useUserTenders();

	const pageTitle = 'Procurement';
	const breadcrumbs = [{ title: 'Procurement', url: '/procurement' }];
	const pageActions = (
		<DisabledComponent>
			<Flex>
				{showSearch ? (
					<ProcurementSearchBar tenders={data} />
				) : (
					<Tooltip hasArrow label="Search tender">
						<IconButton
							variant={'outline'}
							aria-label={'Search'}
							colorScheme={'gray'}
							icon={<SearchIcon color={'black'} />}
							onClick={() => setShowSearch((v) => !v)}
						/>
					</Tooltip>
				)}

				<Button onClick={() => setShowCreateTender(true)} ml={1}>
					New Tender
				</Button>
			</Flex>
		</DisabledComponent>
	);
	const extraNav = (
		<DisabledComponent>
			<>
				{!showCreateTender ? (
					<Flex
						borderBottom={'1px'}
						backgroundColor={'white'}
						borderColor={'gray.400'}
						width={'100%'}
					>
						<Box width={'100%'} mt={2}>
							<Flex justify={'space-around'}>
								<NavLink to={'/tender'} end>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Tender
										</Box>
									)}
								</NavLink>

								<NavLink to={'tender-offers'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											width={'100%'}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Offers Received
										</Box>
									)}
								</NavLink>

								<NavLink to={'invitations'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Tender Invitations
										</Box>
									)}
								</NavLink>

								<NavLink to={'my-offers'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Submitted Offers
										</Box>
									)}
								</NavLink>

								<NavLink to={'bids'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Create Bid
										</Box>
									)}
								</NavLink>
								<NavLink to={'bid-responses'}>
									{({ isActive }) => (
										<Box
											as="button"
											borderBottom={isActive ? '2px' : 'hidden	'}
											borderColor={'gray.600'}
											p={1}
											_hover={{
												borderBottom: '2px',
												borderColor: 'gray.300'
											}}
										>
											Bids Received
										</Box>
									)}
								</NavLink>
							</Flex>
						</Box>
					</Flex>
				) : (
					<Flex
						justifyContent={'end'}
						borderBottom={'1px'}
						backgroundColor={'white'}
						borderColor={'gray.400'}
						width={'100%'}
					>
						<Button
							variant="link"
							colorScheme="gray"
							onClick={() => setShowCreateTender(false)}
							mr={6}
							mt={2}
						>
							Show tender list
						</Button>
					</Flex>
				)}
			</>
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
				{extraNav}
			</Box>
			<>
				{showCreateTender ? (
					<NewTenderCreate setShowCreateTender={setShowCreateTender} />
				) : (
					<>
						<Box>{<Outlet />}</Box>
					</>
				)}
			</>
		</>
	);
}

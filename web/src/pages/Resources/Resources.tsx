import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	HStack,
	Heading,
	Link,
	Text
} from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { CardBase } from '../../components/CardBase';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { SimpleColumnDef, Table } from '../../components/table/Table'; // Import SimpleColumnDef
import { ModalContext } from '../../context/ModalContext';
import { Resource, ResourceStatus } from '../../models/Resource';
import { useResourceDelete } from '../../mutations/useResourceDelete';
import { useResourceTypes } from '../../queries/useResourceTypes';
import { useResources } from '../../queries/useResources';
import { HoldResource } from './HoldResource';
import GigoverMaps from './components/GigoverMaps';
import { ResourceStatusLabel } from './components/ResourceStatusLabel';

export const Resources = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data: resourceTypes } = useResourceTypes();
	const { data, isPending } = useResources();
	const { mutateAsync: deleteResourceAsync, isPending: isLoadingDelete } = useResourceDelete();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const columns: Array<SimpleColumnDef<Resource, any>> = useMemo(
		() => [
			{
				accessorKey: 'serialNr',
				header: 'Id',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cell: ({ value }): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			{
				accessorKey: 'name',
				header: 'Resource',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cell: ({ value }): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			{
				accessorKey: 'type',
				header: 'Type',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cell: ({ value }): JSX.Element => {
					if (resourceTypes) {
						const type = resourceTypes?.areas?.find((t) => t.type === value);

						if (type) {
							return <div>{type.name}</div>;
						}
					}

					return <div>{value}</div>;
				}
			},
			{
				accessorKey: 'status',
				header: 'Status',
				// eslint-disable-next-line react/display-name
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cell: ({ value }): JSX.Element => {
					return <ResourceStatusLabel status={value} />;
				}
			},
			{
				// id: 'actions', // accessorKey is needed for the new Table component
				accessorKey: 'id', // Assuming 'id' or some unique key exists on Resource for actions
				header: 'Actions',
				// eslint-disable-next-line react/display-name
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				cell: ({ row }): JSX.Element => {
					return (
						<HStack spacing={4}>
							{/*<Button*/}
							{/*	variant={'link'}*/}
							{/*	colorScheme={'blue'}*/}
							{/*	onClick={() =>*/}
							{/*		setModalContext({ resources: { resource: row.original } })*/}
							{/*	}*/}
							{/*>*/}
							{/*	View log*/}
							{/*</Button>*/}
							<HoldResource resource={row} />
							<Button
								variant={'outline'}
								colorScheme={'black'}
								onClick={() => setModalContext({ resources: { resource: row } })}
							>
								Edit
							</Button>
							<Button
								variant={'outline'}
								colorScheme={'black'}
								isLoading={isLoadingDelete}
								onClick={async () => await deleteResourceAsync(row)}
							>
								<TrashIcon />
							</Button>
						</HStack>
					);
				}
			}
		],
		[resourceTypes, isLoadingDelete, setModalContext, deleteResourceAsync]
	);

	const pageTitle = 'Resources';
	const breadcrumbs = [{ title: 'Resources', url: '/resources' }];
	const pageActions = (
		<Box display={'flex'} gap={2} alignItems={'center'} py={2} height={'50px'}>
			<Button>New resource</Button>
		</Box>
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
				<Box p={2}>
					<DisabledPage>
						<Flex mb={4}>
							<CardBase px="24px" py="12px" mr="16px" fontWeight="bold" color="black">
								Total resources: {data?.length}
							</CardBase>
							<CardBase
								px="24px"
								py="12px"
								mr="16px"
								fontWeight="bold"
								color="#1FDF83"
							>
								Available:{' '}
								{data?.filter((r) => r.status === ResourceStatus.Available)
									?.length ?? 0}
							</CardBase>
							<CardBase
								px="24px"
								py="12px"
								mr="16px"
								fontWeight="bold"
								color="#EA4335"
							>
								In use:{' '}
								{data?.filter((r) => r.status === ResourceStatus.InUse)?.length ??
									0}
							</CardBase>
						</Flex>

						<CardBase>
							<Table<Resource>
								loading={isPending}
								variant={'striped'}
								columns={columns}
								data={data ?? []}
							/>
						</CardBase>

						<CardBase mt={4}>
							<Heading as={'h4'} fontSize={'16px'}>
								Where are your resources?
							</Heading>
						</CardBase>
						<CardBase mt={4}>
							<GigoverMaps resources={data ?? []} />
						</CardBase>
					</DisabledPage>
				</Box>
			</Box>
		</>
	);
};

import { Button, Flex, HStack, Heading } from '@chakra-ui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { CellContext, ColumnDef } from '@tanstack/react-table'; // ColumnDef might be used from here, CellContext not
import { useContext, useMemo } from 'react';
import { CardBase } from '../../components/CardBase';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
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
			// {
			// 	header: 'Last update',
			// 	accessorKey: 'year',
			// 	// eslint-disable-next-line react/display-name
			// 	cell: ({ value }: CellContext<Resource, string>): JSX.Element => {
			// 		return <Text fontStyle={'italic'}>{moment(getValue()).format('YYYY-MM-DD')}</Text>;
			// 	}
			// },
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

	return (
		<Page
			title={'Resources'}
			actions={
				<DisabledComponent>
					<Button onClick={() => setModalContext({ resources: { resource: undefined } })}>
						New resource
					</Button>
				</DisabledComponent>
			}
		>
			<DisabledPage>
				<Flex mb={4}>
					<CardBase px="24px" py="12px" mr="16px" fontWeight="bold" color="black">
						Total resources: {data?.length}
					</CardBase>
					<CardBase px="24px" py="12px" mr="16px" fontWeight="bold" color="#1FDF83">
						Available:{' '}
						{data?.filter((r) => r.status === ResourceStatus.Available)?.length ?? 0}
					</CardBase>
					<CardBase px="24px" py="12px" mr="16px" fontWeight="bold" color="#EA4335">
						In use:{' '}
						{data?.filter((r) => r.status === ResourceStatus.InUse)?.length ?? 0}
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
		</Page>
	);
};

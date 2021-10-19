import React, { useContext, useMemo } from 'react';
import { Page } from '../../components/Page';
import { Table } from '../../components/table/Table';
import { CellProps, Column } from 'react-table';
import { Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { SearchBar } from '../Files/components/SearchBar';
import { CardBase } from '../../components/CardBase';
import styled from 'styled-components';
import moment from 'moment';
import GigoverMaps from './components/GigoverMaps';
import { useResources } from '../../queries/useResources';
import { Resource, ResourceStatus } from '../../models/Resource';
import { ModalContext } from '../../context/ModalContext';
import { useResourceTypes } from '../../queries/useResourceTypes';
import { HoldResource } from './HoldResource';
import { useResourceDelete } from '../../mutations/useResourceDelete';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { ResourceStatusLabel } from './components/ResourceStatusLabel';

const ResourceData = styled(CardBase)<{ color?: string }>`
	padding: 12px 24px;
	margin-right: 16px;
	color: ${(props) => props.color || 'black'};
	font-weight: bold;
`;

export const Resources = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isError, isLoading } = useResources();
	const { mutateAsync: deleteResourceAsync, isLoading: isLoadingDelete } = useResourceDelete();
	const { data: resourceTypes } = useResourceTypes();

	const columns: Array<Column<Resource>> = useMemo(
		() => [
			{
				Header: 'Resource',
				accessor: 'name',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value } }: CellProps<Resource, string>): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			{
				Header: 'Id',
				accessor: 'id',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value } }: CellProps<Resource, string>): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			{
				Header: 'Type',
				accessor: 'type',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value } }: CellProps<Resource, number>): JSX.Element => {
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
				Header: 'Last update',
				accessor: 'year',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value } }: CellProps<Resource, string>): JSX.Element => {
					return <Text fontStyle={'italic'}>{moment(value).format('YYYY-MM-DD')}</Text>;
				}
			},
			{
				Header: 'Status',
				accessor: 'status',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value } }: CellProps<Resource, ResourceStatus>): JSX.Element => {
					return <ResourceStatusLabel status={value} />;
				}
			},
			{
				Header: 'Actions',
				// eslint-disable-next-line react/display-name
				Cell: ({ row }: CellProps<Resource, string>): JSX.Element => {
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
							<HoldResource resource={row.original} />
							<Button
								variant={'outline'}
								colorScheme={'black'}
								onClick={() =>
									setModalContext({ resources: { resource: row.original } })
								}
							>
								Edit
							</Button>
							<Button
								variant={'outline'}
								colorScheme={'black'}
								isLoading={isLoadingDelete}
								onClick={async () => await deleteResourceAsync(row.original)}
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
			tabs={<SearchBar files={[]} />}
			actions={
				<>
					<Button
						onClick={() => setModalContext({ resources: { resource: undefined } })}
						leftIcon={<PlusIcon />}
					>
						New resource
					</Button>
				</>
			}
		>
			<Flex mb={4}>
				<ResourceData>Total resources: {data?.length}</ResourceData>
				<ResourceData color={'#1FDF83'}>
					Available:{' '}
					{data?.filter((r) => r.status === ResourceStatus.Available)?.length ?? 0}
				</ResourceData>
				<ResourceData color={'#EA4335'}>
					In use: {data?.filter((r) => r.status === ResourceStatus.InUse)?.length ?? 0}
				</ResourceData>
			</Flex>

			<CardBase>
				<Table loading={isLoading} variant={'striped'} columns={columns} data={data} />
			</CardBase>

			<CardBase mt={4}>
				<Heading as={'h4'} fontSize={'16px'}>
					Where are your resources?
				</Heading>
			</CardBase>
			<CardBase mt={4}>
				<GigoverMaps
					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
					loadingElement={<div style={{ height: '100%' }} />}
					containerElement={<div style={{ height: '400px' }} />}
					mapElement={<div style={{ height: '100%' }} />}
				/>
			</CardBase>
		</Page>
	);
};

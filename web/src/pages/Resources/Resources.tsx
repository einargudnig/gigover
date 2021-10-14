import React, { useMemo } from 'react';
import { Page } from '../../components/Page';
import { Table } from '../../components/table/Table';
import { CellProps, Column } from 'react-table';
import { Button, Flex, HStack, Text, Heading } from '@chakra-ui/react';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SearchBar } from '../Files/components/SearchBar';
import { CardBase } from '../../components/CardBase';
import styled from 'styled-components';
import ResourceStatusLabel from './components/ResourceStatusLabel';
import moment from 'moment';
import GigoverMaps from './components/GigoverMaps';
import { useResources } from '../../queries/useResources';
import { Resource } from '../../models/Resource';

const ResourceData = styled(CardBase)<{ color?: string }>`
	padding: 12px 24px;
	margin-right: 16px;
	color: ${(props) => props.color || 'black'};
	font-weight: bold;
`;

export const Resources = (): JSX.Element => {
	const { data, isError, isLoading } = useResources();

	const columns: Array<Column<Resource>> = useMemo(
		() => [
			{
				Header: 'Resource',
				accessor: 'name',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <div>{value}</div>;
				}
			},

			{
				Header: 'Id',
				accessor: 'id',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			{
				Header: 'Type',
				accessor: 'type',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <div>{value}</div>;
				}
			},
			/*			{
				Header: 'Status',
				accessor: 'status',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <ResourceStatusLabel status={value} />;
				}
			},*/
			{
				Header: 'Last update',
				accessor: 'year',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <Text fontStyle={'italic'}>{moment(value).format('YYYY-MM-DD')}</Text>;
				}
			},
			{
				Header: 'Actions',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return (
						<HStack spacing={4}>
							<Button variant={'link'} colorScheme={'blue'}>
								View log
							</Button>
							<Button>Use</Button>
							<Button variant={'outline'} colorScheme={'black'}>
								Edit
							</Button>
						</HStack>
					);
				}
			}
		],
		[]
	);

	return (
		<Page
			title={'Resources'}
			tabs={<SearchBar files={[]} />}
			actions={
				<>
					<Button onClick={() => alert('bla')} leftIcon={<UploadIcon />}>
						New resource
					</Button>
				</>
			}
		>
			<Flex mb={4}>
				<ResourceData>Total resources: {data?.length}</ResourceData>
				<ResourceData color={'#1FDF83'}>Available: {data?.length}</ResourceData>
				<ResourceData color={'#EA4335'}>In use: {data?.length}</ResourceData>
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
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: `400px` }} />}
					mapElement={<div style={{ height: `100%` }} />}
				/>
			</CardBase>
		</Page>
	);
};

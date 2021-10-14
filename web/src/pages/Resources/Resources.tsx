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

const ResourceData = styled(CardBase)<{ color?: string }>`
	padding: 12px 24px;
	margin-right: 16px;
	color: ${(props) => props.color || 'black'};
	font-weight: bold;
`;

export const Resources = (): JSX.Element => {
	const columns: Array<Column<any>> = useMemo(
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
			{
				Header: 'Status',
				accessor: 'status',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <ResourceStatusLabel status={value} />;
				}
			},
			{
				Header: 'Last update',
				accessor: 'lastUpdate',
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

	const data = [
		{
			name: 'Truck',
			id: 'JON29',
			type: 'Car',
			status: 0,
			lastUpdate: new Date()
		},
		{
			name: 'Other',
			id: 'JON29',
			type: 'Bus',
			status: 1,
			lastUpdate: new Date()
		},
		{
			name: 'Truck',
			id: 'JON29',
			type: 'Join',
			status: 0,
			lastUpdate: new Date()
		}
	];
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
				<ResourceData>Total resources: 9</ResourceData>
				<ResourceData color={'#1FDF83'}>Available: 5</ResourceData>
				<ResourceData color={'#EA4335'}>In use: 3</ResourceData>
			</Flex>

			<CardBase>
				<Table variant={'striped'} columns={columns} data={data} />
			</CardBase>

			<CardBase mt={4}>
				<Heading as={'h4'} fontSize={'16px'}>Where are your resources?</Heading>
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

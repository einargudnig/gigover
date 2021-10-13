import React, { useMemo } from 'react';
import { Page } from '../../components/Page';
import { Table } from '../../components/table/Table';
import { CellProps, Column } from 'react-table';

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
					return <div>{value}</div>;
				}
			},					{
				Header: 'Last update',
				accessor: 'lastUpdate',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <div>{value.toString()}</div>;
				}
			},
			{
				Header: 'Actions',
				// eslint-disable-next-line react/display-name
				Cell: ({ cell: { value }, row }: CellProps<any, string>): JSX.Element => {
					return <div>rassgat</div>;
				}
			},
		],
		[]
	);


	const data = [
		{
			name: 'Truck',
			id: 'JON29',
			type: 'Car',
			status: 0,
			lastUpdate: new Date(),
		},
		{
			name: 'Other',
			id: 'JON29',
			type: 'Bus',
			status: 1,
			lastUpdate: new Date(),
		},
		{
			name: 'Truck',
			id: 'JON29',
			type: 'Join',
			status: 0,
			lastUpdate: new Date(),
		}

	]
	return (
		<Page title={'Resources'}>
			<div>
				<h1>Users</h1>
			</div>

			<div>
				<Table columns={columns} data={data} />
			</div>
		</Page>
	);
};

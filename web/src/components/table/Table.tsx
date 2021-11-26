import React from 'react';
import { Table as ChakraTable, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useExpanded, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import { LoadingSpinner } from '../LoadingSpinner';

interface TableProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	loading: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getRowProps?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getHeaderProps?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getColumnProps?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getCellProps?: any;
	variant?: string;
	colorScheme?: string;
}

const defaultPropGetter = () => ({});

const StyledTh = styled.th`
	border-bottom: 1px solid #e5e5e5 !important;
	color: black !important;
	&:first-child {
		position: sticky;
		left: 0;
		background: #fbfbfb;
		z-index: 2;
	}
`;

const StyledTd = styled.td`
	&:first-child {
		position: sticky;
		left: 0;
		background: #fbfbfb;
		z-index: 2;
	}
`;

export const Table = ({
	columns,
	data,
	loading = false,
	variant = 'simple',
	colorScheme = 'gray',
	getHeaderProps = defaultPropGetter,
	getColumnProps = defaultPropGetter,
	getRowProps = defaultPropGetter,
	getCellProps = defaultPropGetter
}: TableProps): JSX.Element => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data
		},
		useSortBy,
		useExpanded
	);

	if (loading) {
		return <LoadingSpinner />;
	}

	// Render the UI for your table
	// @ts-ignore
	return (
		<div style={{ maxWidth: '100%', overflowX: 'auto' }}>
			<ChakraTable variant={variant} colorScheme={colorScheme} {...getTableProps()}>
				<Thead>
					{headerGroups.map((headerGroup, rowIndex) => (
						<Tr {...headerGroup.getHeaderGroupProps()} key={rowIndex}>
							{headerGroup.headers.map((column, colIndex) => (
								<Th
									as={StyledTh}
									{...column.getHeaderProps([
										getColumnProps(column),
										getHeaderProps(column)
									])}
									//@ts-ignore
									{...column.getHeaderProps(column.getSortByToggleProps())}
									key={colIndex}
								>
									{column.render('Header')}
									<span>
										{
											//@ts-ignore
											column.isSorted
												? //@ts-ignore
												  column.isSortedDesc
													? ' 🔽'
													: ' 🔼'
												: ''
										}
									</span>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps(getRowProps(row))} key={`row_${i}`}>
								{row.cells.map((cell, cellI) => {
									return (
										<Td
											as={StyledTd}
											{...cell.getCellProps([
												getColumnProps(cell.column),
												getCellProps(cell)
											])}
											key={cellI}
										>
											{cell.render('Cell')}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</ChakraTable>
		</div>
	);
};

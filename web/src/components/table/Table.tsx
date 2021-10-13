import React from 'react';
import { Table as ChakraTable, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useExpanded, useTable } from 'react-table';
import styled from 'styled-components';

interface TableProps {
	columns: any;
	data: any;
	getRowProps?: any;
	getHeaderProps?: any;
	getColumnProps?: any;
	getCellProps?: any;
}

const defaultPropGetter = () => ({});

const StyledTh = styled.th`
	&:first-child {
		position: sticky;
		left: 0;
		background: #fbfbfb;
		border-right: 1px inset #e5e5e5;
		z-index: 2;
	}
`;

const StyledTd = styled.td`
	&:first-child {
		position: sticky;
		left: 0;
		background: #fbfbfb;
		border-right: 1px inset #e5e5e5;
		z-index: 2;
	}
`;

export const Table = ({
	columns,
	data,
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
		useExpanded
	);

	// Render the UI for your table
	return (
		<div style={{ maxWidth: '100%', overflowX: 'auto' }}>
			<ChakraTable variant={'simple'} {...getTableProps()}>
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
								>
									{column.render('Header')}
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

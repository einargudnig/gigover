// @ts-nocheck
import { Box, Table as ChakraTable, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import {
	CellPropGetter,
	Column,
	HeaderPropGetter,
	TableRowProps,
	UseTableColumnProps,
	useExpanded,
	useSortBy,
	useTable
} from 'react-table';
import { LoadingSpinner } from '../LoadingSpinner';

// eslint-disable-next-line @typescript-eslint/ban-types
interface TableProps<T extends object = {}, C extends object = {}> {
	columns: Column<C>[];
	data: T;
	loading: boolean;
	getRowProps?: TableRowProps;
	getHeaderProps?: HeaderPropGetter<T>;
	getColumnProps?: UseTableColumnProps<T>;
	getCellProps?: CellPropGetter<T>;
	variant?: string;
	colorScheme?: string;
}

const defaultPropGetter = () => ({});

// eslint-disable-next-line @typescript-eslint/ban-types
export function Table<T extends object = {}, C extends object = {}>({
	columns,
	data,
	loading = false,
	variant = 'simple',
	colorScheme = 'gray',
	getHeaderProps = defaultPropGetter,
	getColumnProps = defaultPropGetter,
	getRowProps = defaultPropGetter,
	getCellProps = defaultPropGetter
}: TableProps<T, C>): JSX.Element {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>(
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
	return (
		<Box maxWidth="100%" overflowX="auto">
			<ChakraTable variant={variant} colorScheme={colorScheme} {...getTableProps()}>
				<Thead>
					{headerGroups.map((headerGroup, rowIndex) => (
						<Tr {...headerGroup.getHeaderGroupProps()} key={rowIndex}>
							{headerGroup.headers.map((column, colIndex) => {
								return (
									<Th
										borderBottom="1px solid #e5e5e5 !important"
										color="black !important"
										sx={{
											'&:first-child': {
												position: 'sticky',
												left: 0,
												background: '#fbfbfb',
												zIndex: 2
											}
										}}
										{...column.getHeaderProps([
											getColumnProps(column),
											getHeaderProps(column)
										])}
										{...column.getHeaderProps(column.getSortByToggleProps())}
										key={colIndex}
									>
										<Flex justify="space-between" align="center">
											<Box>
												{column.render('Header')}
												<Text as="span">
													{column.isSorted
														? column.isSortedDesc
															? ' 🔽'
															: ' 🔼'
														: ''}
												</Text>
											</Box>
											{column.canSort && (
												<Box>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width={22}
														height={26}
														viewBox="0 0 100 125"
													>
														<path
															d="M50,5A28.12,28.12,0,0,0,21.88,33.13V66.88a28.13,28.13,0,0,0,56.25,0V33.13A28.12,28.12,0,0,0,50,5ZM27.5,33.13a22.5,22.5,0,0,1,45,0V47.19h-45ZM50,89.38a22.53,22.53,0,0,1-22.5-22.5V52.81h45V66.88A22.53,22.53,0,0,1,50,89.38Z"
															fill="currentColor"
														/>
														<path
															d="M50,21.41,39.16,32.25a1.41,1.41,0,0,0,0,2l2,2a1.41,1.41,0,0,0,2,0L50,29.37l6.86,6.86a1.41,1.41,0,0,0,2,0l2-2a1.41,1.41,0,0,0,0-2Z"
															fill="currentColor"
														/>
														<path
															d="M58.85,64a1.41,1.41,0,0,0-2,0L50,70.87,43.14,64a1.41,1.41,0,0,0-2,0l-2,2a1.41,1.41,0,0,0,0,2L50,78.83,60.84,68a1.41,1.41,0,0,0,0-2Z"
															fill="currentColor"
														/>
													</svg>
												</Box>
											)}
										</Flex>
									</Th>
								);
							})}
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
											borderBottom="1px solid #e5e5e5 !important"
											color="black !important"
											sx={{
												'&:first-child': {
													position: 'sticky',
													left: 0,
													background: '#fbfbfb',
													zIndex: 2
												}
											}}
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
		</Box>
	);
}

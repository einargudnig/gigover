// @ts-nocheck
import { Box, Table as ChakraTable, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { LoadingSpinner } from '../LoadingSpinner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SimpleColumnDef<TData extends object, TValue = any> {
	accessorKey: keyof TData;
	header: string | (() => JSX.Element);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cell: (props: {
		row: TData;
		value: TValue;
	}) => JSX.Element | string | number | null | undefined;
}

interface TableProps<T extends object = object> {
	columns: SimpleColumnDef<T>[];
	data: T[];
	loading: boolean;
	variant?: string;
	colorScheme?: string;
}

export function Table<T extends object = object>({
	columns,
	data,
	loading = false,
	variant = 'simple',
	colorScheme = 'gray'
}: TableProps<T>): JSX.Element {
	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<Box maxWidth="100%" overflowX="auto">
			<ChakraTable variant={variant} colorScheme={colorScheme}>
				<Thead>
					<Tr>
						{columns.map((column, colIndex) => (
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
								key={`header-${String(column.accessorKey)}-${colIndex}`}
							>
								{typeof column.header === 'function'
									? column.header()
									: column.header}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((row, rowIndex) => (
						<Tr key={`row-${rowIndex}`}>
							{columns.map((column, cellIndex) => {
								const value = row[column.accessorKey];
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
										key={`cell-${String(
											column.accessorKey
										)}-${rowIndex}-${cellIndex}`}
									>
										{column.cell({ row, value })}
									</Td>
								);
							})}
						</Tr>
					))}
				</Tbody>
			</ChakraTable>
		</Box>
	);
}

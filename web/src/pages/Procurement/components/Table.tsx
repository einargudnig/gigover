import {
	Box,
	Table as ChakraTable,
	HStack,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr
} from '@chakra-ui/react';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';

interface TableColumn {
	header: string;
	accessor: string;
	tooltip?: string;
	width?: string;
	isNumber?: boolean;
}

interface TableProps<T> {
	columns: TableColumn[];
	data: T[];
	variant?: 'simple' | 'striped' | 'unstyled';
	emptyStateMessage?: string;
}

export function DataTable<T extends object>({
	columns,
	data,
	variant = 'striped',
	emptyStateMessage = 'No data available'
}: TableProps<T>): JSX.Element {
	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const formatValue = (value: unknown, column: TableColumn) => {
		if (column.isNumber && typeof value === 'number') {
			return formatNumber(value);
		}
		return value as string | number;
	};

	return (
		<Box overflowX="auto" w="100%">
			<ChakraTable variant={variant}>
				<Thead>
					<Tr>
						{columns.map((column, index) => (
							<Th key={index} width={column.width || 'auto'}>
								{column.tooltip ? (
									<Tooltip hasArrow label={column.tooltip}>
										<HStack>
											<Text>{column.header}</Text>
											<ImportantIcon size={20} />
										</HStack>
									</Tooltip>
								) : (
									<Text>{column.header}</Text>
								)}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{data.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length} textAlign="center">
								<Text fontSize="lg">{emptyStateMessage}</Text>
							</Td>
						</Tr>
					) : (
						data.map((item, rowIndex) => (
							<Tr key={rowIndex}>
								{columns.map((column, colIndex) => (
									<Td
										key={`${rowIndex}-${colIndex}`}
										width={column.width || 'auto'}
									>
										{formatValue(item[column.accessor], column)}
									</Td>
								))}
							</Tr>
						))
					)}
				</Tbody>
			</ChakraTable>
		</Box>
	);
}

// Example usage:
// interface TenderItem {
//   nr: number;
//   description: string;
//   volume: number;
//   unit: string;
// }
//
// const columns = [
//   {
//     header: 'Number',
//     accessor: 'nr',
//     tooltip: 'Cost code',
//     width: '20%'
//   },
//   {
//     header: 'Description',
//     accessor: 'description',
//     tooltip: 'Description of an item',
//     width: '20%'
//   },
//   {
//     header: 'Volume',
//     accessor: 'volume',
//     tooltip: 'Volume',
//     width: '20%'
//   },
//   {
//     header: 'Unit',
//     accessor: 'unit',
//     tooltip: 'Unit of measurement. For example: m2, kg, t',
//     width: '20%'
//   }
// ];
//
// return <DataTable<TenderItem> columns={columns} data={items} />;

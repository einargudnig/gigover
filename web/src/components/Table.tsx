import { Table as ChakraTable, TableProps } from '@chakra-ui/react';

// The original component was a styled.table.
// We are replacing it with a functional component that uses Chakra UI's Table components.
// Users will need to use Chakra's <Thead>, <Tbody>, <Tfoot>, <Tr>, <Th>, <Td> components as children.

// The styles from the original styled.table will be applied to the ChakraTable and its subcomponents.
// export const Table = styled.table` // Removed styled-component
// 	width: 100%;
// 	text-align: left;
// 	border-collapse: collapse;
//
// 	th,
// 	td {
// 		padding: 8px;
// 	}
//
// 	thead {
// 		th {
// 			font-weight: bold;
// 			margin-bottom: 8px;
// 			padding-bottom: 8px;
// 			border-bottom: 2px solid #e5e5e5;
// 		}
// 	}
//
// 	tfoot {
// 		td {
// 			margin-top: 8px;
// 			padding-top: 24px;
// 			border-top: 2px solid #e5e5e5;
// 		}
// 	}
// `;

// We define a new Table component that wraps ChakraTable and applies some default styles.
// For more specific styling of th, td, thead, tfoot, users should style those Chakra components directly.
export const Table = (props: TableProps): JSX.Element => {
	return (
		<ChakraTable
			width="100%"
			textAlign="left"
			borderCollapse="collapse"
			sx={{
				'th, td': {
					padding: '8px'
				},
				'thead th': {
					fontWeight: 'bold',
					marginBottom: '8px',
					paddingBottom: '8px',
					borderBottom: '2px solid #e5e5e5'
				},
				'tfoot td': {
					marginTop: '8px',
					paddingTop: '24px',
					borderTop: '2px solid #e5e5e5'
				}
			}}
			{...props}
		/>
	);
};

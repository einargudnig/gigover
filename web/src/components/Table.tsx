import styled from 'styled-components';

export const Table = styled.table`
	width: 100%;
	text-align: left;
	border-collapse: collapse;

	th,
	td {
		padding: 8px;
	}

	thead {
		th {
			font-weight: bold;
			margin-bottom: 8px;
			padding-bottom: 8px;
			border-bottom: 2px solid #e5e5e5;
		}
	}
`;

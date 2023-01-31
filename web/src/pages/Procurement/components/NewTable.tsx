import React, { useState } from 'react';
import { Table, Tbody, Td, Thead, Tr, Th, Input } from '@chakra-ui/react';

interface Data {
	id: string;
	name: string;
	age: number;
}

const data: Data[] = [
	{ id: '1', name: 'John Doe', age: 30 },
	{ id: '2', name: 'Jane Doe', age: 25 },
	{ id: '3', name: 'Jim Smith', age: 35 }
];

export const NewTable: React.FC = () => {
	const [tableData, setTableData] = useState(data);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
		const updatedData = tableData.map((d) => {
			if (d.id === id) {
				return {
					...d,
					[e.target.name]: e.target.value
				};
			}
			return d;
		});
		setTableData(updatedData);
	};

	return (
		<Table>
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Age</Th>
				</Tr>
			</Thead>
			<Tbody>
				{tableData.map((d) => (
					<Tr key={d.id}>
						<Td>
							<Input
								name="name"
								value={d.name}
								onChange={(e) => handleChange(e, d.id)}
							/>
						</Td>
						<Td>
							<Input
								name="age"
								value={d.age}
								onChange={(e) => handleChange(e, d.id)}
							/>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

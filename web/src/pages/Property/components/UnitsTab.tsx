import { Box, Button, Flex, Heading, Input, Spacer, Text } from '@chakra-ui/react';
import { ChangeEvent, useContext, useMemo, useState } from 'react';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalContext } from '../../../context/ModalContext';
import { IPropertyUnit } from '../../../models/Property';
import { Units } from './Units';

export function UnitTab({
	propertyId,
	units,
	isFetching
}: {
	propertyId: number;
	units: IPropertyUnit[];
	isFetching: boolean;
}): JSX.Element {
	const [, setModalContext] = useContext(ModalContext);

	const [searchTerm, setSearchTerm] = useState('');

	// Use useMemo to prevent unnecessary filtering on every render
	const filteredUnits = useMemo(() => {
		const searchTermLower = searchTerm.toLowerCase().trim();

		return units.filter(
			(unit) =>
				unit.name.toLowerCase().includes(searchTermLower) ||
				unit.type.toLowerCase().includes(searchTermLower)
		);
	}, [units, searchTerm]);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Flex mb={8} alignItems={'center'}>
				<Box>
					<Heading mb={'4'} fontSize={'xl'}>
						Units
					</Heading>
				</Box>
				<Spacer />
				<Box>
					<Flex align="center">
						<Input
							placeholder="Search for name or type.."
							rounded="md"
							width="220px"
							size="md"
							borderColor={'black'}
							mr={4}
							value={searchTerm}
							onChange={handleSearch}
						/>
						<Button
							variant="outline"
							colorScheme="black"
							onClick={() =>
								setModalContext({
									addUnit: {
										unit: undefined,
										propertyId: Number(propertyId)
									}
								})
							}
						>
							Add unit
						</Button>
					</Flex>
				</Box>
			</Flex>
			{!units || units.length === 0 ? (
				<Text m={4}>No units!</Text>
			) : (
				<>
					{isFetching ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						<Box>
							{filteredUnits?.map((unit) => (
								<Units
									unit={unit}
									propertyId={Number(propertyId)}
									key={unit.unitId}
								/>
							))}
						</Box>
					)}
				</>
			)}
		</Box>
	);
}

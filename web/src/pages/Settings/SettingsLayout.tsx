import { Box, Text } from '@chakra-ui/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();

	return (
		<>
			<Box>
				<Text fontWeight="bold" color={'gray.700'}>
					Organization
				</Text>
				{isPending || isFetching ? (
					<LoadingSpinner />
				) : (
					<Text>{data?.map((org) => org.name).join(', ')}</Text>
				)}
			</Box>
		</>
	);
}

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';

export const OrganizationSwitcher = () => {
	const { data } = useGetOrganizations();
	const { mutate } = useChangeOrganizations();

	const handleOrganizationChange = (id: number) => {
		console.log({ id });
		mutate({ id });
	};

	return (
		<Box pr={3}>
			<Menu>
				<MenuButton
					as={Button}
					variant={'outline'}
					colorScheme={'gray'}
					rightIcon={<ChevronDownIcon />}
					_active={{ bg: 'transparent' }}
					_hover={{ textColor: 'gray.700' }}
				>
					Organization
				</MenuButton>
				<MenuList>
					{data && data.length > 0 ? (
						data.map((org) => (
							<MenuItem key={org.id} onClick={() => handleOrganizationChange(org.id)}>
								{org.name}
							</MenuItem>
						))
					) : (
						<Text padding={1} textAlign="center">
							No organizations
						</Text>
					)}
				</MenuList>
			</Menu>
		</Box>
	);
};

import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';

export const OrganizationSwitcher = () => {
	const { data } = useGetOrganizations();

	return (
		<Menu>
			<MenuButton
				as={Button}
				variant={'outline'}
				width={'full'}
				rightIcon={<ChevronDownIcon />}
				_active={{ bg: 'transparent' }}
				_hover={{ textColor: 'yellow.700' }}
			>
				Organization
			</MenuButton>
			<MenuList>
				{data && data.length > 0 ? (
					data.map((org) => <MenuItem key={org.id}>{org.name}</MenuItem>)
				) : (
					<Text padding={1} textAlign="center">
						No organizations
					</Text>
				)}
			</MenuList>
		</Menu>
	);
};

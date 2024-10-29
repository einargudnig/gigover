import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { CreateOrganization } from './CreateOrganization';
import { ManageOrganizationInvites } from './ManageOrganizationInvites';

export const OrganizationSwitcher = () => {
	const { data } = useGetOrganizations();
	console.log('data from useGetOrganizations', data);
	const { data: userInfo, isLoading } = useGetUserInfo();
	console.log('data from useGetUserInfo', userInfo);
	const { mutate } = useChangeOrganizations();

	const currentOrganization = userInfo?.organization;

	const handleOrganizationChange = (id: number) => {
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
					isLoading={isLoading}
				>
					{currentOrganization?.name || 'Personal Space'}
				</MenuButton>
				<MenuList>
					<MenuItem onClick={() => handleOrganizationChange(0)}>Personal space</MenuItem>
					{data && data.length > 0
						? data.map((org) => (
								<MenuItem
									key={org.id}
									onClick={() => handleOrganizationChange(org.id)}
								>
									{org.name}
								</MenuItem>
						  ))
						: null}
					<MenuDivider />
					<MenuItem>
						<CreateOrganization />{' '}
					</MenuItem>
					<MenuItem>
						<ManageOrganizationInvites />
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};

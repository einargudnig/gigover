import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { CreateOrganization } from './CreateOrganization';
import { ManageOrganizationInvites } from './ManageOrganizationInvites';
import { LoadingSpinner } from '../LoadingSpinner';
import { ManageOrganization } from './ManageOrganization';

export const OrganizationSwitcher = () => {
	const { data, isLoading, isFetching } = useGetOrganizations();
	const { data: userInfo, isLoading: userIsLoading } = useGetUserInfo();
	const { mutate } = useChangeOrganizations();
	const location = useLocation();

	const isOnProjectIdPage = /^\/project\/\d+$/.test(location.pathname);
	const isOnPropertyIdPage = /^\/property\/\d+$/.test(location.pathname);
	const isOnFilesIdPage = /^\/files\/\d+\/?$/.test(location.pathname);

	const currentOrganization = userInfo?.organization;

	const handleOrganizationChange = (id: number) => {
		mutate({ id });

		if (isOnProjectIdPage) {
			window.location.assign('/');
		} else if (isOnPropertyIdPage) {
			window.location.assign('/property');
		} else if (isOnFilesIdPage) {
			window.location.assign('/files');
		}
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
					isLoading={userIsLoading || isLoading || isFetching}
				>
					<Flex>
						{isLoading || isFetching ? <LoadingSpinner /> : null}
						{currentOrganization?.name || 'Personal Space'}
					</Flex>
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
						<ManageOrganization />
					</MenuItem>
					<MenuItem>
						<CreateOrganization />
					</MenuItem>
					<MenuDivider />
					<MenuItem>
						<ManageOrganizationInvites />
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};

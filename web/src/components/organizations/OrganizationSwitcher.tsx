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
import { Link, useLocation } from 'react-router-dom';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { LoadingSpinner } from '../LoadingSpinner';

export const OrganizationSwitcher = () => {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo, isPending: userIsPending } = useGetUserInfo();
	const { mutate } = useChangeOrganizations();
	const location = useLocation();

	const isOnProjectIdPage = /^\/project\/\d+$/.test(location.pathname);
	const isOnPropertyIdPage = /^\/property\/\d+$/.test(location.pathname);
	const isOnFilesIdPage = /^\/files\/\d+\/?$/.test(location.pathname);

	const currentOrganization = userInfo?.organization;

	const privMap = {
		ADMIN: '(Admin)',
		EDITOR: '(Editor)',
		VIEWER: '(Viewer)'
	}[userInfo?.organization?.priv];

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
					isLoading={userIsPending || isPending || isFetching}
				>
					<Flex>
						{isPending || isFetching ? <LoadingSpinner /> : null}
						{currentOrganization?.name || 'Personal Space'} - {privMap}
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
						<Button variant={'link'} colorScheme={'black'}>
							<Link to="settings">Manage organizations</Link>
						</Button>
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};

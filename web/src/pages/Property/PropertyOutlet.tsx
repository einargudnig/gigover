import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Page } from '../../components/Page';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { ModalContext } from '../../context/ModalContext';
import { PropertySearchBar } from './components/PropertySearchBar';

export const PropertyOutlet = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [showSearch, setShowSearch] = useState(false);
	return (
		<Page
			title={'Property'}
			actions={
				<DisabledComponent>
					<Flex align="center">
						{showSearch ? (
							<PropertySearchBar setShowSearch={setShowSearch} />
						) : (
							<Tooltip hasArrow label={'Search for property'}>
								<IconButton
									variant={'outline'}
									aria-label={'Search'}
									colorScheme={'gray'}
									icon={<SearchIcon color={'black'} />}
									onClick={() => setShowSearch((v) => !v)}
								/>
							</Tooltip>
						)}
						<Button
							ml={3}
							onClick={() =>
								setModalContext({ addProperty: { property: undefined } })
							}
						>
							New Property
						</Button>
					</Flex>
				</DisabledComponent>
			}
		>
			<DisabledPage>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Box overflowY={'auto'} height={'100%'} width={'100%'}>
							<Outlet />
						</Box>
					</HStack>
				</VStack>
			</DisabledPage>
		</Page>
	);
};

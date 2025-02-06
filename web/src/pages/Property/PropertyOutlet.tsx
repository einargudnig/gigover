import { SearchIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { ModalContext } from '../../context/ModalContext';
import { PropertySearchBar } from './components/PropertySearchBar';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

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
						<Container>
							<Outlet />
						</Container>
					</HStack>
				</VStack>
			</DisabledPage>
		</Page>
	);
};

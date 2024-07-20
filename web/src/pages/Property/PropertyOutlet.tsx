import { SearchIcon } from '@chakra-ui/icons';
import { Button, HStack, IconButton, VStack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { ModalContext } from '../../context/ModalContext';
import { SearchBar } from './components/SearchBar';

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
				<>
					{showSearch ? (
						<SearchBar />
					) : (
						<IconButton
							variant={'outline'}
							aria-label={'Search'}
							colorScheme={'gray'}
							icon={<SearchIcon color={'black'} />}
							onClick={() => setShowSearch((v) => !v)}
						/>
					)}
					<Button
						onClick={() => setModalContext({ addProperty: { property: undefined } })}
					>
						New Property
					</Button>
				</>
			}
		>
			<VStack style={{ height: '100%' }}>
				<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
					<Container>
						<Outlet />
					</Container>
				</HStack>
			</VStack>
		</Page>
	);
};

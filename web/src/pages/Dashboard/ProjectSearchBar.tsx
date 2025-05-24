import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useOutsideClick
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Project } from '../../models/Project';
import { useProjectList } from '../../queries/useProjectList';

const SearchResults = styled.div`
	position: absolute;
	top: 50px;
	left: 0px;
	width: 100%;
	background: white;
	box-shadow: ${(props) => props.theme.shadows.lg};
	border-radius: ${(props) => props.theme.radius(2)};
	z-index: 99;
	padding: ${(props) => props.theme.padding(2)};
`;

export const ProjectSearchBar = (): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const refInput = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const { data, isPending } = useProjectList();
	const properties = data;

	useOutsideClick({
		ref: ref,
		handler: () => {
			setIsOpen(false);
		}
	});

	const filterProjects = (searchStr: string): Project[] => {
		if (properties) {
			return properties.filter((f: Project) =>
				f.name.toLowerCase().includes(searchStr.toLowerCase())
			);
		}

		return [];
	};

	return (
		<>
			{isPending ? (
				<Flex my={12} justifyContent={'center'}>
					<LoadingSpinner />
				</Flex>
			) : (
				<InputGroup>
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						ref={refInput}
						placeholder="Search for projects"
						onFocus={() => setIsOpen(true)}
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
					/>
				</InputGroup>
			)}
			{isOpen && searchValue.length > 0 && (
				<SearchResults ref={ref}>
					{filterProjects(searchValue).map((project, i) => (
						<Box
							key={i}
							cursor="pointer"
							_hover={{ background: '#efefef' }}
							borderRadius={6}
							px={2}
							py={1}
							onClick={() => {
								setSearchValue('');
								setIsOpen(false);
							}}
						>
							<Text>{project.name}</Text>
						</Box>
					))}
				</SearchResults>
			)}
		</>
	);
};

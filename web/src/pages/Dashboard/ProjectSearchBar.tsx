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
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Project } from '../../models/Project';
import { useProjectList } from '../../queries/useProjectList';

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
				// Replaced SearchResults with Box and Chakra style props
				<Box
					ref={ref}
					position="absolute"
					top="50px"
					left="0px"
					width="100%"
					bg="white"
					boxShadow="lg" // Assuming theme.shadows.lg maps to 'lg'
					borderRadius="2xl" // Assuming theme.radius(2) maps to '2xl' or a similar large radius
					zIndex={99}
					p={2} // Assuming theme.padding(2) maps to p={2}
				>
					{filterProjects(searchValue).map((project, i) => (
						<Box
							key={i}
							cursor="pointer"
							_hover={{ background: '#efefef' }}
							borderRadius={6} // This was px={2} py={1} before, now it is a direct number, might need adjustment.
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
				</Box>
			)}
		</>
	);
};

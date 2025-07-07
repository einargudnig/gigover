import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuItem,
	MenuList,
	useOutsideClick
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import { ProjectFile } from '../../../models/ProjectFile';

interface SearchBarProps {
	files: ProjectFile[];
}

export const SearchBar = ({ files }: SearchBarProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const refInput = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	useOutsideClick({
		ref: ref,
		handler: () => setIsOpen(false)
	});

	useEffect(() => {
		if (searchValue.length > 0) {
			setIsOpen(true);

			if (refInput.current) {
				// Keep focus on the input element
				setTimeout(() => {
					refInput.current!.focus();
				}, 0);
			}
		} else {
			setIsOpen(false);
		}
	}, [searchValue, refInput]);

	const searchResults = useMemo<ProjectFile[]>(() => {
		if (searchValue.length > 0) {
			const results = files.filter((res) =>
				JSON.stringify(res).toLowerCase().includes(searchValue.toLowerCase())
			);
			return results.slice(0, 4);
		}

		return [];
	}, [files, searchValue]);

	return (
		<InputGroup>
			<Input
				autoComplete={'off'}
				autoCorrect={'off'}
				name="search"
				placeholder="Search file system"
				variant={'filled'}
				style={{ minWidth: '400px' }}
				value={searchValue}
				ref={refInput}
				onChange={(e) => {
					setSearchValue(e.target.value);
					e.target.focus(); // Keep the focus on the input
				}}
			/>
			<InputRightElement pointerEvents={'none'}>
				<SearchIcon />
			</InputRightElement>
			<Box
				ref={ref}
				position="absolute"
				top="calc(100% + 8px)"
				width="100%"
				left="0"
				right="0"
				zIndex="dropdown"
			>
				<Menu isOpen={isOpen} autoSelect={false}>
					<MenuList width={'400px'}>
						{searchResults.length > 0 ? (
							searchResults.map((r, key) => (
								<NavLink key={key} to={`/files/${r.projectId}/file/${r.imageId}`}>
									<MenuItem onClick={() => setSearchValue('')}>{r.name}</MenuItem>
								</NavLink>
							))
						) : (
							<MenuItem>No results found</MenuItem>
						)}
					</MenuList>
				</Menu>
			</Box>
		</InputGroup>
	);
};

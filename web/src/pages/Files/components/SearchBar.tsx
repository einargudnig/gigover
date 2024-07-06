import {
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuItem,
	MenuList,
	useOutsideClick
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import { ProjectFile } from '../../../models/ProjectFile';

interface SearchBarProps {
	files: ProjectFile[];
}

const SearchResults = styled.div`
	position: absolute;
	top: 100%;
	top: calc(100% + 8px);
	width: 100%;
	left: 0;
	right: 0;
`;

const StyledMenuList = styled(MenuList)`
	width: 400px;
`;

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
			<SearchResults ref={ref}>
				<Menu isOpen={isOpen} autoSelect={false}>
					<StyledMenuList>
						{searchResults.length > 0 ? (
							searchResults.map((r, key) => (
								<NavLink key={key} to={`/files/${r.projectId}/file/${r.imageId}`}>
									<MenuItem onClick={() => setSearchValue('')}>{r.name}</MenuItem>
								</NavLink>
							))
						) : (
							<MenuItem>No results found</MenuItem>
						)}
					</StyledMenuList>
				</Menu>
			</SearchResults>
		</InputGroup>
	);
};

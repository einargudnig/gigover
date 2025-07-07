import { Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../../components/forms/SearchBar';
import { Project } from '../../models/Project';
import { useProjectList } from '../../queries/useProjectList';

export const ProjectSearchBar = (): JSX.Element => {
	const { data: projects, isPending } = useProjectList();
	const navigate = useNavigate();

	if (isPending) {
		return <Text>Loading...</Text>;
	}

	const filterPredicate = (project: Project, query: string) => {
		return project.name.toLowerCase().includes(query.toLowerCase());
	};

	const renderResult = (project: Project) => project.name;

	const handleSelect = (project: Project) => {
		navigate(`/project/${project.projectId}`);
	};

	return (
		<SearchBar<Project>
			data={projects || []}
			filterPredicate={filterPredicate}
			renderResult={renderResult}
			onSelect={handleSelect}
			placeholder="Search for projects"
		/>
	);
};

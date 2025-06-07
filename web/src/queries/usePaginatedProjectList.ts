import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { ApiService } from '../services/ApiService';

export const useProjectsPaginated = (pageSize = 10) => {
	const [currentPage, setCurrentPage] = useState(0);

	const { data: allProjects, ...query } = useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectList, {
				withCredentials: true
			});
			return response.data;
		},
		staleTime: 5 * 60 * 1000,
		select: (data) =>
			data.map((project) => ({
				projectId: project.projectId,
				name: project.name,
				status: project.status,
				endDate: project.endDate
				// Only keep essential data
			}))
	});

	const paginatedData = useMemo(() => {
		if (!allProjects) return { projects: [], totalPages: 0 };

		const startIndex = currentPage * pageSize;
		const endIndex = startIndex + pageSize;
		const projects = allProjects.slice(startIndex, endIndex);
		const totalPages = Math.ceil(allProjects.length / pageSize);

		return { projects, totalPages, currentPage };
	}, [allProjects, currentPage, pageSize]);

	return {
		...paginatedData,
		setCurrentPage,
		...query
	};
};

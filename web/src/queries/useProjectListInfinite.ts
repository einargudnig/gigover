// hooks/useProjectsInfiniteScroll.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProjectList } from './useProjectList';

export const useProjectsInfiniteScroll = (initialSize = 20, loadMoreSize = 10) => {
	const [visibleCount, setVisibleCount] = useState(initialSize);
	const loadMoreRef = useRef(null);

	const { data: allProjects, ...query } = useProjectList();

	const lightweightProjects = useMemo(() => {
		if (!allProjects) return [];
		return allProjects.map((project) => ({
			projectId: project.projectId,
			name: project.name,
			status: project.status,
			endDate: project.endDate,
			startDate: project.startDate,
			lexoRank: project.lexoRank,
			progressStatus: project.progressStatus,
			owner: project.owner
			// Keep only essential fields for the list view
		}));
	}, [allProjects]);

	const visibleProjects = useMemo(() => {
		return lightweightProjects.slice(0, visibleCount);
	}, [lightweightProjects, visibleCount]);

	const loadMore = useCallback(() => {
		setVisibleCount((prev) => Math.min(prev + loadMoreSize, lightweightProjects.length));
	}, [loadMoreSize, lightweightProjects.length]);

	const hasMore = visibleCount < lightweightProjects.length;

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !query.isFetching) {
					loadMore();
				}
			},
			{ threshold: 0.1, rootMargin: '100px' }
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [hasMore, loadMore, query.isFetching]);

	// Reset visible count when data changes
	useEffect(() => {
		if (lightweightProjects.length > 0) {
			setVisibleCount(Math.min(initialSize, lightweightProjects.length));
		}
	}, [lightweightProjects.length, initialSize]);

	return {
		projects: visibleProjects,
		allProjects: lightweightProjects, // For filtering
		loadMoreRef,
		hasMore,
		totalCount: lightweightProjects.length,
		visibleCount,
		isLoading: query.isPending,
		isFetching: query.isFetching,
		error: query.error,
		refetch: query.refetch
	};
};

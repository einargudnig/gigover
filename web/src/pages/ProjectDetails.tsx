import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../queries/useProjectDetails';

const FeedBoard = styled.div`
	display: flex;
	flex-direction: row;
`;

const KanbanBoard = styled.div`
	max-width: 100%;
	overflow-x: auto;
	flex: 1;
	padding: 0 ${(props): string => props.theme.padding(4)};
	user-select: none;
`;

const FeedColumn = styled.div`
	background: #fff;
	border-radius: 12px;
	padding: ${(props): string => props.theme.padding(3)};
	margin: ${(props): string => props.theme.padding(2)};
	width: 33%;
	min-height: 500px;
	display: flex;
	flex-direction: column;
	h3 {
		margin: 0 0 ${(props): string => props.theme.padding(2)};
		padding-bottom: ${(props): string => props.theme.padding(2)};
		border-bottom: 1px solid #eee;
	}
	&:not(:last-child) {
		margin-right: ${(props): string => props.theme.padding(2)};
	}
	> div {
		flex: 1;
		border-radius: 3px;
	}
`;

const ProjectDetailsPage = styled.div`
	padding: 40px 0;
`;

export const ProjectDetails = (): JSX.Element => {
	const { projectId } = useParams();
	const { data, isLoading, isError, error } = useProjectDetails(parseInt(projectId));
	const project = (data && data.project) ?? { name: 'Invalid' };

	return (
		<Page breadcrumbs={[project.name, 'Tasks']} noContentPadding={true}>
			<ProjectDetailsPage>
				{isLoading ? (
					<p>Loading</p>
				) : isError ? (
					<p>
						Error fetching project with id: {projectId} - Reason: {error?.errorText}.
						Code: {error?.errorCode}
					</p>
				) : (
					<KanbanBoard>
						<FeedBoard>
							<FeedColumn>Test</FeedColumn>
							<FeedColumn>Test</FeedColumn>
							<FeedColumn>Test</FeedColumn>
						</FeedBoard>
					</KanbanBoard>
				)}
			</ProjectDetailsPage>
		</Page>
	);
};

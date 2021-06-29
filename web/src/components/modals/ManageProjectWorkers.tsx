import React from 'react';
import styled from 'styled-components';
import { Spacer, Box, Flex, Button, Heading } from '@chakra-ui/react';
import { AddWorkerForm } from '../../pages/ProjectDetails/AddWorkerForm';
import { Project, WorkerItem } from '../../models/Project';
import { useRemoveWorker } from '../../queries/useRemoveWorker';
import { Modal } from '../Modal';
import { LoadingSpinner } from '../LoadingSpinner';
import { InviteUser } from '../InviteUser/InviteUser';
import { TrashIcon } from '../icons/TrashIcon';
import { validateEmail } from '../../utils/StringUtils';

const Divider = styled.div`
	height: ${(props) => props.theme.padding(3)};
`;

const ManageWorkersModalStyled = styled.div`
	h3 {
		display: flex;
		align-items: center;
		margin-bottom: ${(props) => props.theme.padding(2)};
		border-bottom: 1px solid ${(props) => props.theme.colors.border};
		padding-bottom: ${(props) => props.theme.padding(2)};

		svg {
			margin-left: 8px;
		}
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding-left: 0;

		li {
			padding: 12px 0;
			display: flex;
			justify-content: space-between;

			&:not(:last-child) {
				border-bottom: 1px solid ${(props) => props.theme.colors.border};
			}
		}
	}
`;

interface ManageProjectWorkersProps {
	onClose: () => void;
	project: Project;
}

export const ManageProjectWorkers = ({
	onClose,
	project
}: ManageProjectWorkersProps): JSX.Element => {
	const { mutate: removeWorker, isLoading } = useRemoveWorker();

	const remove = async (worker: WorkerItem) => {
		await removeWorker({
			projectId: project.projectId,
			uId: worker.uId
		});
	};

	return (
		<Modal title={'Add team members'} open={true} onClose={onClose}>
			<ManageWorkersModalStyled>
				<Flex justifyContent={'stretch'} alignItems={'start'}>
					<Box flexGrow={1}>
						<InviteUser projectId={project.projectId} />
					</Box>
					<Spacer />
					<Box flexGrow={1}>
						<AddWorkerForm projectId={project.projectId} />
					</Box>
				</Flex>
				<Divider />
				<div>
					<Heading as={'h3'} size={'md'}>
						Team members {isLoading && <LoadingSpinner />}
					</Heading>
					<ul>
						{project.workers.map((worker, workerIndex) => (
							<li key={workerIndex}>
								{worker.name}{' '}
								{validateEmail(worker.userName) ? '(Web user)' : '(App user)'}
								<Button
									size={'sm'}
									variant={'outline'}
									colorScheme={'red'}
									onClick={() => remove(worker)}
								>
									<TrashIcon color={'red'} />
								</Button>
							</li>
						))}
					</ul>
				</div>
			</ManageWorkersModalStyled>
		</Modal>
	);
};

import { Box, Button, Flex, Heading, List, ListItem, Spacer, Text } from '@chakra-ui/react';
import { Project, WorkerItem } from '../../models/Project';
import { AddWorkerForm } from '../../pages/ProjectDetails/AddWorkerForm';
import { useRemoveWorker } from '../../queries/useRemoveWorker';
import { InviteUser } from '../InviteUser/InviteUser';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { TrashIcon } from '../icons/TrashIcon';
// import { validateEmail } from '../../utils/StringUtils';
import { useRemoveUser } from '../../queries/useRemoveUser';

interface ManageProjectWorkersProps {
	onClose: () => void;
	project: Project;
}

export const ManageProjectWorkers = ({
	onClose,
	project
}: ManageProjectWorkersProps): JSX.Element => {
	const { mutate: removeWorker, isPending: isLoading } = useRemoveWorker();
	const { mutate: removeUser, isPending: isLoadingTwo } = useRemoveUser();

	const remove = async (worker: WorkerItem) => {
		if (worker.type === 1) {
			// Web User
			await removeUser({
				projectId: project.projectId,
				uId: worker.uId
			});
		} else {
			// App user
			await removeWorker({
				projectId: project.projectId,
				uId: worker.uId
			});
		}
	};

	return (
		<Modal title={'Add team members'} open={true} onClose={onClose}>
			<Box>
				<Text marginBottom={'4'} as={'h4'}>
					To add team members, they must have signed up for GigOver.
				</Text>
				<Flex justifyContent={'stretch'} alignItems={'start'}>
					<Box flexGrow={1}>
						<InviteUser projectId={project.projectId} />
					</Box>
					<Spacer />
					<Box flexGrow={1}>
						<AddWorkerForm projectId={project.projectId} />
					</Box>
				</Flex>
				<Box h={3} />
				<div>
					<Heading
						as={'h3'}
						size={'md'}
						display="flex"
						alignItems="center"
						mb={2}
						borderBottomWidth="1px"
						borderColor="gray.200"
						pb={2}
						sx={{ svg: { ml: '8px' } }}
					>
						Team members {(isLoading || isLoadingTwo) && <LoadingSpinner />}
					</Heading>
					<List styleType="none" m={0} pl={0}>
						{project.workers.map((worker, workerIndex) => (
							<ListItem
								key={workerIndex}
								py="12px"
								display="flex"
								justifyContent="space-between"
								borderBottomWidth={
									workerIndex < project.workers.length - 1 ? '1px' : '0'
								}
								borderColor="gray.200"
							>
								{worker.name} {worker.type === 1 ? '(Web user)' : '(App user)'}
								<Button
									size={'sm'}
									variant={'outline'}
									colorScheme={'red'}
									onClick={() => remove(worker)}
								>
									<TrashIcon color={'red'} />
								</Button>
							</ListItem>
						))}
					</List>
				</div>
			</Box>
		</Modal>
	);
};

import { Box, Flex, Text } from '@chakra-ui/react';
import { Resource } from '../../models/Resource';
import { useResourceHistory } from '../../queries/useResourceHistory';
import { LoadingSpinner } from '../LoadingSpinner';
import { ResourceHistoryTimeSlot } from './ResourceHistoryTimeSlot';

export interface ResourceHistoryLogProps {
	resource: Resource;
}

export const ResourceHistoryLog = ({ resource }: ResourceHistoryLogProps): JSX.Element => {
	const { data, isPending, isError, error } = useResourceHistory(resource);

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <div>{error?.errorText}</div>;
	}

	return (
		<Flex direction="column-reverse">
			{data?.resources.length === 0 && <p>No logs available</p>}
			{data?.resources.map((i) => (
				<>
					<Box
						display="flex"
						justifyContent="center"
						width="100%"
						flexDirection="column"
						gap={2}
						sx={{
							'&:not(:last-child)': {
								marginTop: 6
							}
						}}
					>
						<Flex justifyContent="center">
							<Box
								paddingX={2}
								paddingY={1}
								fontWeight="normal"
								fontSize="14px"
								borderRadius="24px"
								boxShadow="0 5px 10px rgba(0, 0, 0, 0.06)"
								background="#fff"
								color="#838894"
								display="inline-flex"
							>
								{i.userName}
							</Box>
						</Flex>
						{i.projectName && i.projectName.length > 0 && (
							<Flex justifyContent="center">
								<Text
									marginTop={-1.5}
									fontSize="12px"
									color="#838894"
									fontStyle="italic"
								>
									Resource used in project:{' '}
									<Text as="strong" color="#000">
										{i.projectName}
									</Text>
									&nbsp;
									{i.taskName && i.taskName.length > 0 && (
										<>
											in task:{' '}
											<Text as="strong" color="#000">
												{i.taskName}
											</Text>
										</>
									)}
								</Text>
							</Flex>
						)}
						<Flex gap={2} justifyContent="space-evenly" alignItems="center">
							<ResourceHistoryTimeSlot
								inUse={false}
								isHold={true}
								item={i}
								resource={resource}
							/>
							<ResourceHistoryTimeSlot
								isHold={false}
								inUse={i.stop === null}
								item={i}
								resource={resource}
							/>
						</Flex>
					</Box>
				</>
			))}
		</Flex>
	);
};

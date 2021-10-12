import {Avatar, Box, Button, Flex, Heading, Text} from '@chakra-ui/react';
import {Input} from '../../../components/forms/Input';
import React from 'react';
import {Project} from '../../../models/Project';
import {ProjectFolder} from '../../../models/ProjectFolder';
import {ShareItemContext} from "../../../context/ModalContext";

const ShareItem = ({ shareItem }: { shareItem: ShareItemContext }) => {
	return (
		<div>
			<Flex direction={'column'}>
				<Heading mb={4}>Share with other users</Heading>
				<Input placeholder={'Add people'} />
				{shareItem.project?.workers.map((s) => {
					return (
						<Flex my={4} justifyContent={'space-between'} alignItems={'center'}>
							<Flex alignItems={'center'}>
								<Avatar name={s.name} mr={4} />
								<Box>
									<Text color={'black'} fontSize={'lg'} fontWeight={'500'}>
										{s.name}
									</Text>
									<Text>{s.userName}</Text>
								</Box>
							</Flex>
							<Text a={'i'}>{s.type === 0 ? 'Owner' : 'Worker'}</Text>
						</Flex>
					);
				})}

				<Flex justifyContent={'end'}>
					<Button>Done</Button>
				</Flex>
			</Flex>
			<Heading mb={4}>Get Link</Heading>

			<Flex justifyContent={'space-between'}>
				<Box>
					<Text>
						<b>Restricted </b>
						Only people signed in can open the link
					</Text>
				</Box>
				<Button variant="link" colorScheme="blue">
					Copy link
				</Button>
			</Flex>
		</div>
	);
};

export default ShareItem;

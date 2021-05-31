import React, { useContext, useState } from 'react';
import { Modal } from '../Modal';
import {
	Box,
	Divider,
	Flex,
	Heading,
	HStack,
	IconButton,
	Spacer,
	Tag,
	Text,
	VStack
} from '@chakra-ui/react';
import { humanFileSize } from '../../utils/FileSizeUtils';
import { DownloadIcon } from '../icons/DownloadIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { FileIconForType } from '../../pages/Files/components/File';
import { ProjectFile } from '../../models/ProjectFile';
import { ImageDot } from '../ImageEditor/ImageDot';
import { formatDate } from '../../utils/StringUtils';
import { ImportantIcon } from '../icons/ImportantIcon';
import { UserContext } from '../../context/UserContext';

interface FileSidebarProps {
	onClose: () => void;
	file: ProjectFile;
}
export interface ICommentDot {
	id: number;
	chord: ICommentChord;
	comments: ICommentComment[];
	pageNumber?: number;
}
export interface ICommentChord {
	x: number;
	y: number;
	height: number;
	width: number;
	pageNumber?: number;
}
export interface ICommentComment {
	user?: { name: string; id: string | number };
	date: string;
	comment: string;
	id: number;
}

export const EditPhotoModal = ({ onClose, file }: FileSidebarProps): JSX.Element => {
	const Icon = FileIconForType(file.fileType);
	const [activePoint, setActivePoint] = useState(-1);
	const user = useContext(UserContext);

	const onChangeFileName = (event: React.FocusEvent<HTMLSpanElement>) => {
		console.log(event.target! as Element);
	};

	const [comments, setComments] = useState<ICommentDot[]>([]);

	console.log(comments, 'comments');
	const newComment = (comment: { chord: ICommentChord; comment: string }) => {
		const newId = Math.round(Math.random() * 1000);
		setComments([
			...comments,
			{
				id: newId,
				chord: comment.chord,
				pageNumber: comment.chord.pageNumber,
				comments: [
					{
						id: Math.round(Math.random() * 1000),
						user: {
							name: user.name,
							id: user.phoneNumber
						},
						date: new Date().toISOString(),
						comment: comment.comment
					}
				]
			}
		]);
		setActivePoint(newId);
	};

	const editComment = (comment: { comment: string; id: number }) => {
		const index = comments.findIndex((s) => s.id === comment.id);

		const ec = { ...comments[index] };

		if (ec) {
			ec.comments = [
				...ec.comments,
				{
					id: Math.round(Math.random() * 1000),
					user: {
						name: user.name,
						id: user.phoneNumber
					},
					date: new Date().toISOString(),
					comment: comment.comment
				}
			];
			const newComments = [...comments];
			newComments[index] = ec;
			setComments(newComments);
		}
	};

	const removeComment = (dotId: number, commentId: number) => {
		const index = comments.findIndex((s) => s.id === dotId);

		const co = comments[index];
		if (co?.comments.length === 1) {
			alert('do you want to remove this dot?');
			setComments([...comments.filter((c) => c.id !== dotId)]);
		} else {
			const filteredComments = co?.comments.filter((b) => b.id !== commentId);

			const filteredComment = {
				...co,
				comments: [...filteredComments]
			};
			const returnComments = [...comments];

			returnComments[index] = filteredComment;

			setComments([...returnComments]);
		}
	};
	console.log(file, 'name');

	return (
		<Modal title={'Photo edit'} open={true} onClose={() => onClose()} centerModal={true}>
			<VStack
				align={'stretch'}
				width={{
					base: '100%', // 0-48em
					lg: '80vw'
				}}
				style={{ flex: 1, height: '100%' }}
			>
				<HStack justify={'space-between'} align={'center'} spacing={4}>
					<div>
						<Icon />
					</div>
					<Text isTruncated={true}>
						<span
							contentEditable={true}
							suppressContentEditableWarning
							onBlur={onChangeFileName}
						>
							{file.name}
						</span>
					</Text>
				</HStack>
				<Divider />
				{
					<Flex
						minHeight={'60vh'}
						direction={{
							base: 'column-reverse', // 0-48em
							lg: 'row' // 48em-80em,
						}}
					>
						<Flex
							width={{
								base: '100%', // 0-48em
								lg: '300px'
							}}
						>
							<Flex direction={'column'} width={'100%'}>
								<Heading p={2} pl={0}>
									Notes
								</Heading>
								<Box mb={2} p={4} bg={'#EFEFEF'} borderRadius={6}>
									<ImportantIcon />
									<Text pt={4}>
										Click the image to add notes that will be shared with your
										co-workers
									</Text>
								</Box>

								<Box overflow={'scroll'} maxHeight={'450px'}>
									{comments.map((s) => {
										const currentComment = s.comments[s.comments.length - 1];

										return (
											<>
												<Flex
													p={2}
													py={2}
													direction={'column'}
													key={s.id}
													_hover={{ background: '#ececf1' }}
													cursor={'pointer'}
													onClick={() => setActivePoint(s.id)}
												>
													<Flex>
														<Text pr={2} fontSize={'11px'} isTruncated>
															{currentComment?.user?.name}
														</Text>
														<Text fontSize={'11px'} isTruncated>
															{formatDate(
																new Date(currentComment.date)
															)}
														</Text>
													</Flex>
													<Text
														color={'black'}
														fontWeight={'400'}
														fontSize={'11px'}
														isTruncated
													>
														{currentComment.comment}
													</Text>
													<Flex>
														<Text fontSize={'11px'} isTruncated>
															{s.comments.length} comments
														</Text>
														{s.id === activePoint && (
															<>
																<Spacer />
																<Tag size={'sm'}>Active</Tag>
															</>
														)}
													</Flex>
												</Flex>
												<Divider />
											</>
										);
									})}
								</Box>
							</Flex>
						</Flex>

						<Flex p={2} flex={1}>
							<ImageDot
								newComment={newComment}
								documentType={file.fileType}
								removeComment={removeComment}
								editComment={editComment}
								imageSrc={file.downloadUrl}
								dots={comments}
								setActivePoint={setActivePoint}
								activePoint={activePoint}
							/>
						</Flex>
					</Flex>
				}
				<Divider />

				<VStack align={'stretch'} spacing={4}>
					<div style={{ height: 2 }} />
					<HStack justify={'space-between'} align={'center'}>
						<Heading size={'sm'}>Project</Heading>
						<Text>Name</Text>
					</HStack>
					<HStack justify={'space-between'} align={'center'}>
						<Heading size={'sm'}>Size</Heading>
						<Text>{humanFileSize(file.bytes)}</Text>
					</HStack>
					<div style={{ height: 2 }} />
				</VStack>
				<Spacer />
				<Divider />
				<div style={{ height: 2 }} />
				<HStack justify={'space-between'} align={'center'}>
					<VStack justify={'center'} align={'center'}>
						<a href={file.downloadUrl} target={'_blank'} rel={'noopener noreferrer'}>
							<IconButton
								aria-label={'Download'}
								colorScheme={'black'}
								icon={<DownloadIcon color={'white'} />}
							/>
						</a>
						<Text color={'black'} fontSize={'xs'}>
							Download
						</Text>
					</VStack>
					<VStack justify={'center'} align={'center'}>
						<IconButton
							aria-label={'Delete'}
							colorScheme={'black'}
							icon={<TrashIcon color={'white'} />}
							onClick={() => {
								alert('TODO delete');
							}}
						/>
						<Text color={'black'} fontSize={'xs'}>
							Delete
						</Text>
					</VStack>
				</HStack>
			</VStack>
		</Modal>
	);
};

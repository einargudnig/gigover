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
import { ImageDot } from '../ImageEditor/ImageDot';
import { formatDate } from '../../utils/StringUtils';
import { ImportantIcon } from '../icons/ImportantIcon';
import { useImageDots } from '../../queries/useImageDots';
import {
	useAddImageDot,
	useAddImageDotComment,
	useChangeImageDotStatus,
	useRemoveDotComment,
	useRemoveImageDot
} from '../../mutations/useImageDot';
import { ProjectImage } from '../../models/ProjectImage';
import { GigoverFileIconForType } from '../../pages/Files/components/File';
import { devInfo } from '../../utils/ConsoleUtils';
import { ConfirmDialog } from '../ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { useDeleteDocument } from '../../mutations/useDeleteDocument';
import { ModalContext } from '../../context/ModalContext';
import { ShareIcon } from '../icons/ShareIcon';

interface FileSidebarProps {
	onClose: () => void;
	file: ProjectImage;
	projectId?: number;
	moveFile: (direction: 'left' | 'right') => void;
}

export interface IImageDot extends ICommentChord {
	dotId: number;
	imageId: string;
	status: number;
	comments: ICommentComment[];
}

export interface ICommentChord {
	coordinateX: number;
	coordinateY: number;
	height: number;
	width: number;
	pageNumber?: number;
}

export interface ICommentComment {
	dotId: number;
	comment: string;
	commentId: number;
	created: string;
	uId: string;
	userName: string;
}

export const EditPhotoModal = ({ onClose, file, moveFile }: FileSidebarProps): JSX.Element => {
	const Icon = GigoverFileIconForType(file.type);
	const [activePoint, setActivePoint] = useState(-1);
	const onChangeFileName = (event: React.FocusEvent<HTMLSpanElement>) => {
		devInfo('onChangeFileName', event.target! as Element);
	};
	const [, setModalContext] = useContext(ModalContext);

	const { data, refetch: refetchImageDots } = useImageDots(file.imageId);

	const dots = data?.dots;

	// connected to adding, deleting and updating the dots and their comments
	const { mutateAsync: addImgageDot } = useAddImageDot();
	const { mutateAsync: removeImageDot } = useRemoveImageDot();
	const { mutateAsync: addImageDotComment } = useAddImageDotComment();
	const { mutateAsync: removeImageDotComment } = useRemoveDotComment();
	const { mutateAsync: changeImageDotStatus } = useChangeImageDotStatus();
	/*	const { mutateAsync: editImageDotComment } = useEditDotComment();*/

	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutate: deleteDocument } = useDeleteDocument();

	const updateStatus = async (dotId: number) => {
		const dot = dots?.find((s) => s.dotId === dotId);

		if (dot) {
			await changeImageDotStatus({ dotId, status: dot.status === 0 ? 1 : 0 });
			refetchImageDots();
		}
	};
	const newComment = async (comment: { chord: ICommentChord; comment: string }) => {
		//TODO new dot
		const response = await addImgageDot({ ...comment.chord, imageId: file.imageId });

		//TODO new comment on that dot
		await addImageDotComment({ dotId: response.data.id, comment: comment.comment });
		refetchImageDots();

		setActivePoint(response.data.id);
	};

	const editComment = async (comment: { comment: string; id: number }) => {
		await addImageDotComment({ dotId: comment.id, comment: comment.comment });
		refetchImageDots();
	};

	const removeComment = async (dotId: number, commentId: number) => {
		const dot = dots?.find((s) => s.dotId === dotId);
		if (dot) {
			const comment = dot.comments.find((b) => b.commentId === commentId);
			if (comment) {
				await removeImageDotComment(comment);
			}

			if (dot?.comments.length === 1) {
				//Delete the point aswell
				await removeImageDot(dot);
			}
		}
		refetchImageDots();
	};

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
						{/* Comment section used to be here, now moved below */}
						{/* Removed this containing flex so that the image uses the whole with of the modal */}
						{/* This is the "container" that holds the photo and its dots */}
						<Flex p={2} flex={1} position={'relative'}>
							<ImageDot
								newComment={newComment}
								documentType={file.type}
								removeComment={removeComment}
								editComment={editComment}
								updateStatus={updateStatus}
								imageSrc={file.url}
								dots={dots}
								setActivePoint={setActivePoint}
								activePoint={activePoint}
								isNextImage={true}
								isPrevImage={true}
								prevImage={() => moveFile('left')}
								nextImage={() => moveFile('right')}
							/>
						</Flex>
					</Flex>
				}
				<Divider />

				{/* Flex box with comments and another box with info and buttons */}
				<Flex justify={'space-around'}>
					{/* VStack with Comment info */}
					<VStack>
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

							{/* List of comments */}
							<Box overflow={'scroll'} maxHeight={'350px'}>
								{dots &&
									dots.map((s) => {
										if (s.comments.length === 0) {
											return null;
										}
										const currentComment = s.comments[s.comments.length - 1];

										return (
											<>
												<Flex
													p={2}
													py={2}
													direction={'column'}
													key={s.dotId}
													_hover={{ background: '#ececf1' }}
													cursor={'pointer'}
													onClick={() => setActivePoint(s.dotId)}
												>
													<Flex>
														<Text pr={2} fontSize={'11px'} isTruncated>
															{currentComment?.userName}
														</Text>
														<Text fontSize={'11px'} isTruncated>
															{formatDate(
																new Date(
																	currentComment?.created ||
																		new Date()
																)
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
														{s.dotId === activePoint && (
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
					</VStack>

					{/* VStack with project info and Buttons */}
					<VStack align={'stretch'} w={'250px'}>
						<VStack>
							<div style={{ height: 20 }} />
							<HStack justify={'space-between'} align={'center'}>
								<Heading size={'md'}>Project</Heading>
								<Text>Name</Text>
							</HStack>
							<HStack justify={'space-between'} align={'center'}>
								<Heading size={'md'}>Size</Heading>
								<Text>{humanFileSize(0)}</Text>
							</HStack>
							<div style={{ height: 2 }} />
						</VStack>
						<Spacer />
						{/* Buttons */}
						<HStack justify={'space-between'} align={'center'}>
							<VStack justify={'center'} align={'center'}>
								<IconButton
									aria-label={'Delete'}
									colorScheme={'black'}
									icon={<ShareIcon color={'white'} />}
									onClick={() => {
										setModalContext({ shareItem: { file: file } });
									}}
								/>
								<Text color={'black'} fontSize={'l'}>
									Share
								</Text>
							</VStack>
							<VStack justify={'center'} align={'center'}>
								<a href={file.url} target={'_blank'} rel={'noopener noreferrer'}>
									<IconButton
										aria-label={'Download'}
										colorScheme={'black'}
										icon={<DownloadIcon color={'white'} />}
									/>
								</a>
								<Text color={'black'} fontSize={'l'}>
									Download
								</Text>
							</VStack>
							<VStack justify={'center'} align={'center'}>
								<ConfirmDialog
									header={'Delete image'}
									setIsOpen={setDialogOpen}
									callback={async (b) => {
										if (b) {
											await deleteDocument(file);
											navigate(
												`/files/${file.projectId}/${
													file.folderId > 0 ? file.folderId : ''
												}`
											);
										}
										setDialogOpen(false);
									}}
									isOpen={dialogOpen}
								>
									<IconButton
										aria-label={'Delete'}
										colorScheme={'red'}
										icon={<TrashIcon color={'white'} />}
										onClick={() => {
											setDialogOpen(true);
										}}
									/>
									<Text color={'black'} fontSize={'l'}>
										Delete
									</Text>
								</ConfirmDialog>
							</VStack>
						</HStack>
						<div style={{ height: 10 }} />
					</VStack>
				</Flex>
			</VStack>
		</Modal>
	);
};

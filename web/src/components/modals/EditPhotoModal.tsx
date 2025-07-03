import {
	Box,
	Divider,
	Flex,
	HStack,
	Heading,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Tag,
	Text,
	VStack
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScrollIntoView from 'react-scroll-into-view';
import { ModalContext } from '../../context/ModalContext';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { Project } from '../../models/Project';
import { ProjectImage } from '../../models/ProjectImage';
import { useDeleteDocument } from '../../mutations/useDeleteDocument';
import {
	useAddImageDot,
	useAddImageDotComment,
	useChangeImageDotStatus,
	useRemoveDotComment,
	useRemoveImageDot
} from '../../mutations/useImageDot';
import { GigoverFileIconForType } from '../../pages/Files/components/File';
import { GANT_CHART_FORMAT } from '../../pages/Roadmap/GantChartDates';
import { useImageDots } from '../../queries/useImageDots';
import { useProjectList } from '../../queries/useProjectList';
import { humanFileSize } from '../../utils/FileSizeUtils';
import { formatDate } from '../../utils/StringUtils';
import { ConfirmDialog } from '../ConfirmDialog';
import { ImageDot } from '../ImageEditor/ImageDot';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ImportantIcon } from '../icons/ImportantIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface FileSidebarProps {
	onClose: () => void;
	file: ProjectImage;
	projectId?: number;
	moveFile: (direction: 'left' | 'right') => void;
	isOpen: boolean;
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

export const EditPhotoModal = ({
	file,
	moveFile,
	isOpen,
	onClose
}: FileSidebarProps): JSX.Element => {
	const Icon = GigoverFileIconForType(file.type);
	const [activePoint, setActivePoint] = useState(-1);
	const params = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const { data: projectData } = useProjectList();
	const projects = useOpenProjects(projectData);
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
		await addImageDotComment({ dotId: response.id, comment: comment.comment });
		refetchImageDots();

		setActivePoint(response.id);
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

	// To fetch the project name
	// Can we get it with some ather way?
	// What about propdrilling the project?
	useEffect(() => {
		if (projects.length > 0 && params.projectId) {
			const findProject = projects.find(
				(p) => p.projectId === parseInt(params.projectId as string)
			);

			if (findProject) {
				setProject(findProject);
				return;
			}
		}

		setProject(null);
	}, [projects, params.projectId]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<HStack align={'center'} spacing={4}>
						<div>
							<Icon />
						</div>
						<Text isTruncated={true}>{file.name}p</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack align={'stretch'}>
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
								<Flex p={2} flex={1} position={'relative'}>
									<div id="image" />
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
											Click the image to add notes that will be shared with
											your co-workers
										</Text>
									</Box>

									{/* List of comments */}
									{/* I want to add a scroll snap of some sort, when I press a comment, it auto scrolls to the image.  */}
									<Box overflow={'scroll'} maxHeight={'350px'}>
										{dots &&
											dots.map((s) => {
												if (s.comments.length === 0) {
													return null;
												}
												const currentComment =
													s.comments[s.comments.length - 1];

												return (
													<React.Fragment key={s.dotId}>
														<ScrollIntoView selector="#image">
															<Flex
																p={2}
																py={2}
																direction={'column'}
																_hover={{ background: '#ececf1' }}
																cursor={'pointer'}
																onClick={() =>
																	setActivePoint(s.dotId)
																}
															>
																<Flex>
																	<Text
																		pr={2}
																		fontSize={'11px'}
																		isTruncated
																	>
																		{currentComment?.userName}
																	</Text>
																	<Text
																		fontSize={'11px'}
																		isTruncated
																	>
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
																	<Text
																		fontSize={'11px'}
																		isTruncated
																	>
																		{s.comments.length} comments
																	</Text>
																	{s.dotId === activePoint && (
																		<>
																			<Spacer />
																			<Tag size={'sm'}>
																				Active
																			</Tag>
																		</>
																	)}
																</Flex>
															</Flex>
															<Divider />
														</ScrollIntoView>
													</React.Fragment>
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
										<Text>{project?.name}</Text>
									</HStack>
									<HStack justify={'space-between'} align={'center'}>
										<Heading size={'md'}>Size</Heading>
										<Text>{humanFileSize(file.bytes)}</Text>
									</HStack>
									<HStack justify={'space-between'} align={'center'}>
										<Heading size={'md'}>Created</Heading>
										<Text>
											{DateTime.fromMillis(file.created || 0).toFormat(
												GANT_CHART_FORMAT
											)}
										</Text>
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
										<a
											href={file.url}
											target={'_blank'}
											rel={'noopener noreferrer'}
										>
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
											confirmButtonText="Delete"
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
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

import React, { useCallback, useState } from 'react';
import { useTaskComment } from '../../../queries/useTaskComment';
import { Mention, MentionsInput } from 'react-mentions';
import { WorkerItem } from '../../../models/Project';
import mentionsCls from '../../../styles/mentions.module.css';
import mentionsDraggingCls from '../../../styles/mentionsFileDragActive.module.css';
import { CommentInputLabel } from '../../CommentInputLabel';
import { FileUploadType } from '../../../models/FileUploadType';
import { DropZone } from '../../DropZone';
import { ProjectImage } from '../../../models/ProjectImage';
import { Box, Spinner } from '@chakra-ui/react';
import { CrossIcon } from '../../icons/CrossIcon';
import { useDeleteDocument } from '../../../mutations/useDeleteDocument';

interface CommentInputProps {
	projectId: number;
	taskId: number;
	workers: WorkerItem[];
}

export const CommentInput = ({ projectId, taskId, workers }: CommentInputProps): JSX.Element => {
	const [commentImage, setCommentImage] = useState<
		[ProjectImage, File | undefined] | undefined
	>();
	const [commentValue, setCommentValue] = useState('');
	const { mutateAsync: addComment, isLoading } = useTaskComment();
	const { mutateAsync: deleteDocument, isLoading: isDeleting } = useDeleteDocument();

	// map over the workers object and add '(mobile app)' to the end of the name if the worker type is 0
	const workersWithMobileApp = workers.map((worker) => {
		if (worker.type === 0) {
			return {
				...worker,
				displayName: `${worker.name} (mobile app)` || `${worker.userName} (mobile app)`
			};
		} else {
			return {
				...worker,
				displayName: worker.name || worker.userName
			};
		}
	});

	const onKeyPress = useCallback(
		async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (!e.shiftKey && e.key === 'Enter' && !isLoading && commentValue.trim().length > 0) {
				e.preventDefault();
				e.persist();

				const [projectImage] = commentImage ?? [];

				const response = await addComment({
					comment: commentValue,
					projectId: projectId,
					imageId: projectImage?.imageId,
					taskId: taskId
				});

				if (response?.data.errorCode === 'OK') {
					setCommentValue('');
					setCommentImage(undefined); // Make sure to reset the state, so we don't delete the image on unmount (see useEffect below).
				}
			}
		},
		[addComment, commentValue, commentImage, isLoading, projectId, taskId]
	);

	const [, tempImage] = commentImage ?? [];

	const removeUploadedImage = useCallback(() => {
		const [projectImage] = commentImage ?? [];
		if (projectImage) {
			deleteDocument({
				imageId: projectImage.imageId,
				folderId: projectImage.folderId,
				projectId: projectImage.projectId,
				taskId: projectImage.taskId
			}).then(() => {
				setCommentImage(undefined);
			});
		}
	}, [commentImage, deleteDocument]);

	return (
		<div style={{ position: 'relative', display: 'flex' }}>
			<div style={{ flex: 1 }}>
				<DropZone
					offerId={0}
					projectId={projectId}
					tenderId={0}
					uploadType={FileUploadType.Comment}
					externalId={taskId}
					callback={(uploadedFile, file) => {
						if (uploadedFile) {
							setCommentImage([uploadedFile, file]);
						}
					}}
				>
					{({ isDragActive, isUploading }) => (
						<>
							<MentionsInput
								placeholder={'Write a comment'}
								allowSpaceInQuery={true}
								allowSuggestionsAboveCursor={true}
								onKeyPress={(e) => {
									if (!isUploading) {
										onKeyPress(e);
									}
								}}
								value={commentValue}
								classNames={isDragActive ? mentionsDraggingCls : mentionsCls}
								onChange={(event, newValue) => setCommentValue(newValue)}
							>
								<Mention
									trigger="@"
									data={workersWithMobileApp.map((w) => ({
										id: w.uId,
										display: w.displayName ?? 'Unknown user'
									}))}
									displayTransform={(id, display) => `@${display}`}
								/>
							</MentionsInput>
							{isUploading && (
								<div className={mentionsCls.isUploading}>Uploading</div>
							)}
							<CommentInputLabel />
						</>
					)}
				</DropZone>
			</div>
			{tempImage && (
				<Box ml={2} mt={4} position={'relative'}>
					<img
						src={URL.createObjectURL(tempImage)}
						alt="Uploaded Image"
						style={{ maxHeight: 100, maxWidth: 100, objectFit: 'cover' }}
					/>
					<Box
						width={'24px'}
						height={'24px'}
						borderRadius={'50%'}
						bg={'white'}
						color={'#000'}
						position={'absolute'}
						top={-2}
						right={-2}
						boxShadow={'0 0 10px rgba(0,0,0,.1)'}
						cursor={'pointer'}
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						onClick={() => {
							if (!isDeleting) {
								removeUploadedImage();
							}
						}}
					>
						{isDeleting ? <Spinner /> : <CrossIcon color={'currentColor'} size={16} />}
					</Box>
				</Box>
			)}
		</div>
	);
};

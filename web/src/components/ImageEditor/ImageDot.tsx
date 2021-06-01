/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import {
	Box,
	Text,
	Image as ChakraImage,
	Avatar,
	Flex,
	Button,
	Spacer,
	Input,
	Menu,
	MenuButton,
	MenuList,
	MenuGroup,
	MenuItem
} from '@chakra-ui/react';
import useResizeObserver from 'use-resize-observer';
import { ICommentChord, ICommentComment, ICommentDot } from '../modals/EditPhotoModal';
import { Theme } from '../../Theme';
import { formatDate } from '../../utils/StringUtils';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import styled from 'styled-components';
import { FileType } from '../../models/ProjectFile';

const StyledDiv = styled(Box)`
	canvas {
		width: auto !important;
		max-height: 100%;
		@media screen and (max-width: 800px) {
			height: auto !important;
			max-width: 100%;
		}
	}

	.react-pdf__Page {
		height: 60vh;
	}
`;
// @ts-ignore
const dimenstions = (url, rejectTimeout) => {
	return new Promise((resolve, reject) => {
		// @ts-ignore
		let timer: NodeJS.Timeout = null;

		const img = new Image();

		img.addEventListener('load', () => {
			// @ts-ignore
			if (timer) {
				clearTimeout(timer);
			}

			resolve(img);
		});

		img.addEventListener('error', (event) => {
			if (timer) {
				clearTimeout(timer);
			}

			reject(`${event.type}: ${event.message}`);
		});

		img.src = url;

		if (rejectTimeout) {
			// @ts-ignore
			timer = setTimeout(() => reject('Timeout exception'), rejectTimeout);
		}
	});
};

export const ImageDot = ({
	imageSrc,
	documentType,
	newComment,
	editComment,
	removeComment,
	dots,
	setActivePoint,
	activePoint
}: {
	dots: ICommentDot[];
	imageSrc: string;
	documentType: FileType;
	newComment: (comment: any) => void;
	editComment: (comment: any) => void;
	removeComment: (dotId: number, commentId: number) => void;
	setActivePoint: (id: number) => void;
	activePoint: number;
}): JSX.Element => {
	const [dot, setDot] = useState<{
		x: number;
		y: number;
		height: number;
		width: number;
		pageNumber?: number;
	}>();
	const [imageDimmensions, setImageDimmensions] = useState<{ height: number; width: number }>();
	const [addingDot, setAddingDot] = useState(false);
	const [boxDimmensions, setBoxDimmensions] = useState<{ height: number; width: number }>({
		height: 1,
		width: 1
	});
	const [num, setNumPages] = useState(-1);
	const [pageNumber, setPageNumber] = useState(1);

	// @ts-ignore
	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	const { ref } = useResizeObserver<HTMLDivElement | HTMLCanvasElement>({
		// eslint-disable-next-line no-shadow
		onResize: ({ width, height }) => {
			// @ts-ignore
			if (height && width) {
				setBoxDimmensions({ width, height });
			}
		}
	});

	const addDot = (e: any) => {
		if (activePoint !== -1) {
			setActivePoint(-1);
			return;
		}

		//If already trying to create a new dot just close that
		if (addingDot) {
			setAddingDot(false);
			setActivePoint(-1);
			// @ts-ignore
			setDot(null);
			return;
		}

		const bounds = e.target.getBoundingClientRect();

		setAddingDot(true);
		setDot({
			x: e.clientX - bounds.left,
			y: e.clientY - bounds.top,
			width: boxDimmensions.width,
			height: boxDimmensions.height,
			pageNumber: pageNumber
		});
	};
	const saveNewDot = (comment: string) => {
		// @ts-ignore
		setDot(null);
		newComment({
			chord: { ...dot },
			comment: comment
		});
	};

	const saveNewComment = (comment: any) => {
		editComment(comment);
	};

	useEffect(() => {
		dimenstions(imageSrc, 5000).then((s) => {
			// @ts-ignore
			setImageDimmensions({ height: s.height, width: s.width });
			//setLoading(false);
		});
	}, [imageSrc]);

	const getPosition = useCallback(
		(point: ICommentChord) => {
			if (
				imageDimmensions &&
				(imageDimmensions.width / imageDimmensions.height).toFixed(2) ===
					(boxDimmensions.width / boxDimmensions.height).toFixed(2)
			) {
				const ratioSmaller = 1 - (point.width - boxDimmensions.width) / point.width;

				/*
				const originalWidth =
					(boxDimmensions.height * imageDimmensions.height) / imageDimmensions.width;
				const fluffer = (boxDimmensions.width - originalWidth) / 2;
*/
				//TODO Small ajustments needed
				const blabla = {
					x: point.x * ratioSmaller,
					y: point.y * ratioSmaller
				};
				return blabla;
			}
			return {
				x: point.x + (boxDimmensions.width - point.width) / 2,
				y: point.y + (boxDimmensions.height - point.height) / 2
			};
		},
		[imageDimmensions, boxDimmensions]
	);

	// @ts-ignore
	return (
		<StyledDiv
			borderRadius={12}
			width={'100%'}
			maxHeight={'60vh'}
			background={'black'}
			style={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<Box
				style={{
					position: 'relative',
					display: 'flex',
					maxHeight: '100%'
				}}
			>
				{documentType === 'pdf' ? (
					<>
						{num !== -1 && (
							<Box position={'absolute'} zIndex={2} right={0} bottom={0}>
								<p>
									Page {pageNumber} of {num}
								</p>
								<Button
									onClick={() => {
										setPageNumber(Math.max(pageNumber - 1, 1));
									}}
								>
									Left
								</Button>
								<Button
									onClick={() => {
										setPageNumber(Math.min(pageNumber + 1, num));
									}}
								>
									Right
								</Button>
							</Box>
						)}

						<div onMouseUp={addDot}>
							<Document file={imageSrc} onLoadSuccess={onDocumentLoadSuccess}>
								<Page
									canvasRef={ref}
									renderTextLayer={false}
									pageNumber={pageNumber}
								/>
							</Document>
						</div>
					</>
				) : (
					<ChakraImage
						ref={ref}
						onMouseUp={addDot}
						src={imageSrc}
						maxHeight={'100%'}
						maxWidth={'100%'}
						fit={'contain'}
					/>
				)}
				{dots.map((s, i) => {
					const chord = getPosition(s?.chord);

					if (s.pageNumber !== pageNumber) {
						return null;
					}
					return (
						<ImagePoint
							chord={chord}
							key={i}
							mode={'edit'}
							active={activePoint === s.id}
							comments={s.comments}
							saveComment={(af) => {
								saveNewComment({ comment: af, id: s.id });
							}}
							deleteComment={(commentId) => {
								removeComment(s.id, commentId);
							}}
							clickPoint={() => {
								if (activePoint === s.id) {
									setActivePoint(-1);
								} else {
									setActivePoint(s.id);
									setDot(undefined);
								}
							}}
						/>
					);
				})}
				{dot && (
					<ImagePoint
						mode={'new'}
						saveComment={(af) => {
							saveNewDot(af);
						}}
						chord={dot}
						active={!!dot}
						clickPoint={() => {
							// @ts-ignore
							setDot(null);
							setActivePoint(-1);
						}}
					/>
				)}
			</Box>
		</StyledDiv>
	);
};

const ImagePoint = ({
	chord,
	active,
	comments,
	clickPoint,
	saveComment,
	deleteComment,
	mode
}: {
	chord: { x: number; y: number };
	active: boolean;
	comments?: ICommentComment[];
	clickPoint: (value?: boolean) => void;
	saveComment: (c: string, m?: string) => void;
	deleteComment?: (id: number) => void;
	mode: string;
}): JSX.Element => {
	const [focus, setFocus] = useState(false);
	const [value, setValue] = React.useState('');
	// @ts-ignore
	const handleChange = (event) => setValue(event.target.value);

	useEffect(() => {
		setValue('');
	}, [active]);

	return (
		<div
			style={{
				position: 'absolute',
				top: chord.y - 10,
				left: chord.x - 10,
				display: 'flex'
			}}
		>
			<Box style={{ position: 'relative' }}>
				<Box
					onClick={() => clickPoint()}
					style={{
						height: '20px',
						width: '20px',
						borderRadius: '50%',
						background: active ? Theme.colors.yellow : 'lightgray'
					}}
					_after={{
						content: "''",
						top: '11px',
						left: '0px',
						position: 'absolute',
						borderLeft: '10px solid transparent',
						borderRight: '10px solid transparent',
						borderTop: '18px solid ' + (active ? Theme.colors.yellow : 'lightgray'),
						width: 0,
						height: 0
					}}
				/>
				{active && (
					<Box
						className={'dot'}
						width={'300px'}
						background={'white'}
						borderRadius={'10px'}
						shadow={'md'}
						p={4}
						ml={2}
						zIndex={9999999}
						style={{
							textAlign: 'left',
							position: 'absolute',
							top: '30px',
							left: '-150px'
						}}
					>
						<Box>
							{mode === 'edit' &&
								comments?.map((s, i) => {
									return (
										<Box key={i} my={2}>
											<Flex mb={1} overflowY={'scroll'} maxHeight={'60vh'}>
												<Avatar
													size="xs"
													bg={Theme.colors.green}
													name={s.user?.name}
												/>
												<Text
													pr={2}
													pl={2}
													color={'black'}
													fontWeight={'bold'}
													fontSize={'11px'}
													isTruncated
													maxWidth={'200px'}
												>
													{s.user?.name}
												</Text>
												<Text
													pr={2}
													color={'#838894'}
													fontSize={'11px'}
													isTruncated
												>
													{formatDate(new Date(s.date))}
												</Text>
												<Spacer />
												<Menu>
													<MenuButton
														as={Button}
														aria-label="More actions"
														size="xs"
														variant="ghost"
														color={'black'}
													>
														...
													</MenuButton>
													<MenuList>
														<MenuGroup title="Actions">
															<MenuItem
																onClick={() =>
																	deleteComment &&
																	deleteComment(s.id)
																}
															>
																Delete comment
															</MenuItem>
															{/*		<MenuItem>Turn into task</MenuItem>*/}
														</MenuGroup>
													</MenuList>
												</Menu>
											</Flex>
											<Box ml={'32px'}>
												<Text fontSize={'12px'} color={'black'}>
													{s.comment}
												</Text>
											</Box>
										</Box>
									);
								})}
						</Box>
						<Box>
							<Input
								value={value}
								onChange={handleChange}
								onFocus={() => setFocus(true)}
								placeholder={mode === 'new' ? 'Add comment' : 'Reply'}
								size={'sm'}
							/>
							{(focus || mode === 'new') && (
								<Flex mt={4}>
									<Spacer />
									<Box>
										<Button
											onClick={() => {
												clickPoint();
											}}
											size={'sm'}
											mr="4"
										>
											Cancel
										</Button>
										<Button
											onClick={() => {
												saveComment(value, mode);
												setValue('');
											}}
											disabled={value.length === 0}
											size={'sm'}
										>
											{mode === 'new' ? 'Post' : 'Reply'}
										</Button>
									</Box>
								</Flex>
							)}
						</Box>
					</Box>
				)}
			</Box>
		</div>
	);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Image as ChakraImage } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import 'react-medium-image-zoom/dist/styles.css';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import useKeyPress from '../../hooks/useArrowKey';
import { DocumentTypes } from '../../models/ProjectImage';
import { Chevron } from '../icons/Chevron';
import { IImageDot } from '../modals/EditPhotoModal';
import ImagePoint from './ImagePoint';
// import ImageCanvas from './ImageCanvas';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

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
	updateStatus,
	dots,
	setActivePoint,
	activePoint,
	nextImage,
	prevImage,
	isNextImage,
	isPrevImage
}: {
	dots?: IImageDot[];
	imageSrc: string;
	documentType: DocumentTypes;
	newComment: (comment: any) => void;
	editComment: (comment: any) => void;
	removeComment: (dotId: number, commentId: number) => void;
	updateStatus: (dotId: number, commentId: number) => void;
	setActivePoint: (id: number) => void;
	activePoint: number;
	isNextImage: boolean;
	isPrevImage: boolean;
	nextImage: () => void;
	prevImage: () => void;
}): JSX.Element => {
	const [dot, setDot] = useState<{
		coordinateX: number;
		coordinateY: number;
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
	const [zoomAllowed, setZoomAllowed] = useState(false);
	const [num, setNumPages] = useState(-1);
	const [pageNumber, setPageNumber] = useState(1);

	// @ts-ignore
	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	const moveFile = (direction: 'left' | 'right') => {
		// let file;
		if (direction === 'left') {
			if (pageNumber - 1 < 1) {
				return;
			} else {
				setPageNumber(pageNumber - 1);
			}
		} else {
			if (pageNumber + 1 > num) {
				return;
			} else {
				setPageNumber(pageNumber + 1);
			}
		}
	};

	useKeyPress('ArrowLeft', () => moveFile('left'));
	useKeyPress('ArrowRight', () => moveFile('right'));

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
			coordinateX: e.clientX - bounds.left,
			coordinateY: e.clientY - bounds.top,
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
		(point: IImageDot) => {
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
				return {
					coordinateX: point.coordinateX * ratioSmaller,
					coordinateY: point.coordinateY * ratioSmaller
				};
			}
			return {
				coordinateX: point.coordinateX + (boxDimmensions.width - point.width) / 2,
				coordinateY: point.coordinateY + (boxDimmensions.height - point.height) / 2
			};
		},
		[imageDimmensions, boxDimmensions]
	);

	const renderImage = () => {
		return (
			<Box
				style={{
					position: 'relative',
					display: 'flex',
					maxHeight: '100%'
				}}
			>
				{(() => {
					switch (documentType) {
						case 2:
						case 'DOCUMENT':
							return (
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
									{zoomAllowed ? (
										<Box
											height={'100%'}
											width={'100%'}
											background={'black'}
											zIndex={999999999}
											position={'fixed'}
											top={0}
											left={0}
										>
											<Button m={4} onClick={() => setZoomAllowed(false)}>
												Exit zoom
											</Button>
											<TransformWrapper zoomAnimation={{ size: 0.1 }}>
												<TransformComponent
													wrapperStyle={{ width: '100%', height: '100%' }}
												>
													<Document
														file={imageSrc}
														onLoadSuccess={onDocumentLoadSuccess}
													>
														<Page
															canvasRef={ref}
															renderTextLayer={false}
															pageNumber={pageNumber}
															scale={1.9}
															height={window.innerHeight}
														/>
													</Document>
												</TransformComponent>
											</TransformWrapper>
										</Box>
									) : (
										<div onMouseUp={addDot}>
											<Document
												file={imageSrc}
												onLoadSuccess={onDocumentLoadSuccess}
											>
												<Page
													canvasRef={ref}
													renderTextLayer={false}
													pageNumber={pageNumber}
													scale={1.9}
													height={window.innerHeight}
												/>
											</Document>{' '}
										</div>
									)}
								</>
							);
						case 1:
						case 'VIDEO':
							return (
								<video
									style={{
										maxHeight: '100%',
										maxWidth: '100%',
										objectFit: 'contain'
									}}
									controls={true}
								>
									<source src={imageSrc} type={'video/mp4'} />
								</video>
							);
						case 0:
						case 'IMAGE':
							return zoomAllowed ? (
								<Box
									height={'100%'}
									width={'100%'}
									background={'black'}
									zIndex={999999999}
									position={'fixed'}
									top={0}
									left={0}
								>
									<Button m={4} onClick={() => setZoomAllowed(false)}>
										Exit zoom
									</Button>
									{/* This it the broken ZOOM */}
									{/* <ImageCanvas
										canvasHeight={window.innerHeight}
										canvasWidth={window.innerWidth}
										imageUrl={imageSrc}
									/> */}
									{/* This is the working ZOOM */}
									{/* Replaced it with the react zoom pan pinch and the chakra image */}
									{/* Still need to work the other thing out! */}
									<TransformWrapper zoomAnimation={{ size: 0.1 }}>
										<TransformComponent
											wrapperStyle={{ width: '100%', height: '100%' }}
										>
											<ChakraImage
												ref={ref}
												onMouseUp={addDot}
												src={imageSrc}
												maxHeight={'100%'}
												maxWidth={'100%'}
												fit={'contain'}
											/>
										</TransformComponent>
									</TransformWrapper>
								</Box>
							) : (
								/*	<Zoom>
									<ChakraImage
										ref={ref}
										onMouseUp={addDot}
										src={imageSrc}
										maxHeight={'100%'}
										maxWidth={'100%'}
										fit={'contain'}
									/>
								</Zoom>*/
								<ChakraImage
									ref={ref}
									onMouseUp={addDot}
									src={imageSrc}
									maxHeight={'100%'}
									maxWidth={'100%'}
									fit={'contain'}
								/>
							);
						default:
							return <h1>INVALID FILE TYPE</h1>;
					}
				})()}
				{dots &&
					dots.map((s, i) => {
						const chord = getPosition(s);

						if (s.pageNumber !== pageNumber) {
							return null;
						}
						return (
							<ImagePoint
								status={s.status}
								chord={chord}
								key={i}
								mode={'edit'}
								active={activePoint === s.dotId}
								comments={s.comments}
								saveComment={(af) => {
									saveNewComment({ comment: af, id: s.dotId });
								}}
								deleteComment={(commentId) => {
									removeComment(s.dotId, commentId);
								}}
								updateStatus={(commentId) => {
									updateStatus(s.dotId, commentId);
								}}
								clickPoint={() => {
									if (activePoint === s.dotId) {
										setActivePoint(-1);
									} else {
										setActivePoint(s.dotId);
										setDot(undefined);
									}
								}}
							/>
						);
					})}
				{dot && (
					<ImagePoint
						status={0}
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
		);
	};
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
			{!(documentType === 2 || documentType === 'VIDEO') && (
				<Button
					size={'sm'}
					zIndex={9}
					position={'absolute'}
					top={'0'}
					right={'0'}
					onClick={() => setZoomAllowed(!zoomAllowed)}
				>
					{!zoomAllowed ? 'Allow Zoom' : 'Disable zoom'}
				</Button>
			)}
			{isPrevImage && (
				<Button
					size={'sm'}
					zIndex={9}
					position={'absolute'}
					top={'50%'}
					left={'-8px'}
					onClick={() => prevImage()}
				>
					<Chevron direction={'left'} />
				</Button>
			)}
			{isNextImage && (
				<Button
					size={'sm'}
					zIndex={9}
					position={'absolute'}
					top={'50%'}
					right={'-8px'}
					onClick={() => nextImage()}
				>
					<Chevron direction={'right'} />
				</Button>
			)}
			{zoomAllowed ? renderImage() : renderImage()}
		</StyledDiv>
	);
};

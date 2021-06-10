/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Image as ChakraImage, Button } from '@chakra-ui/react';
import useResizeObserver from 'use-resize-observer';
import { IImageDot } from '../modals/EditPhotoModal';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import styled from 'styled-components';
import { FileType } from '../../models/ProjectFile';
import ImagePoint from './ImagePoint';

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
	dots?: IImageDot[];
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
					x: point.coordinateX * ratioSmaller,
					y: point.coordinateY * ratioSmaller
				};
			}
			return {
				x: point.coordinateX + (boxDimmensions.width - point.width) / 2,
				y: point.coordinateY + (boxDimmensions.height - point.height) / 2
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
				{dots &&
					dots.map((s, i) => {
						const chord = getPosition(s);

						if (s.pageNumber !== pageNumber) {
							return null;
						}
						return (
							<ImagePoint
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

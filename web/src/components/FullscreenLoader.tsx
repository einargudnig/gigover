import React from 'react';
import styled from 'styled-components';

const TransitionDuration = '2s';
const PathLength = '157px'; // Retrieved using SVG's getTotalLength()

const FullscreenLoaderStyled = styled.div`
	width: 100%;
	height: 100%;
	background: #000;
	display: flex;
	justify-content: center;
	align-items: center;

	svg {
		overflow: visible;
		width: 100px;
		height: 150px;

		g {
			animation: slide ${TransitionDuration} linear infinite;

			&:nth-child(2) {
				animation-delay: 0.5s;

				path {
					animation-delay: 0.5s;
					stroke-dasharray: 0px 158px;
					stroke-dashoffset: 1px;
				}
			}
		}

		path {
			stroke: url(#gradient);
			stroke-width: 20px;
			stroke-linecap: round;
			fill: none;
			stroke-dasharray: 0 ${PathLength};
			stroke-dashoffset: 0;
			animation: escalade ${TransitionDuration} cubic-bezier(0.8, 0, 0.2, 1) infinite;
		}
	}

	@keyframes slide {
		0% {
			transform: translateY(-50px);
		}
		100% {
			transform: translateY(50px);
		}
	}

	@keyframes escalade {
		0% {
			stroke-dasharray: 0 ${PathLength};
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 156px ${PathLength};
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dasharray: 156px ${PathLength};
			stroke-dashoffset: -156px;
		}
	}
`;

export const FullscreenLoader = (): JSX.Element => {
	return (
		<FullscreenLoaderStyled>
			<svg>
				<g>
					<path d="M 50,100 A 1,1 0 0 1 50,0" />
				</g>
				<g>
					<path d="M 50,75 A 1,1 0 0 0 50,-25" />
				</g>
				<defs>
					<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={'#1FDF83'} />
						<stop offset="100%" stopColor={'#1FD4DF'} />
					</linearGradient>
				</defs>
			</svg>
		</FullscreenLoaderStyled>
	);
};

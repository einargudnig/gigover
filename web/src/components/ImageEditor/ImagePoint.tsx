import { ICommentComment } from '../modals/EditPhotoModal';
import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Flex,
	Input,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Spacer,
	Text
} from '@chakra-ui/react';
import { Theme } from '../../Theme';
import { formatDate } from '../../utils/StringUtils';

const ImagePoint = ({
	chord,
	active,
	comments,
	clickPoint,
	saveComment,
	deleteComment,
	mode
}: {
	chord: { coordinateX: number; coordinateY: number };
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
				top: chord.coordinateY - 10,
				left: chord.coordinateX - 10,
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
													name={s.userName}
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
													{s.userName}
												</Text>
												<Text
													pr={2}
													color={'#838894'}
													fontSize={'11px'}
													isTruncated
												>
													{formatDate(new Date(s.created))}
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
																	deleteComment(s.commentId)
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

export default ImagePoint;

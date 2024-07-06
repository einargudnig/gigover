import styled from 'styled-components';

interface UserProps {
	avatar: string;
	name: string;
}

const UserStyled = styled.div`
	display: flex;
	align-items: center;
	user-select: none;

	div.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		overflow: hidden;
		margin-right: ${(props) => props.theme.padding(1.5)};

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	p {
		font-size: 18px;
	}
`;

export const User = ({ avatar, name }: UserProps): JSX.Element => (
	<UserStyled>
		<div className={'avatar'}>
			<img src={avatar} alt={name} />
		</div>
		<p>{name}</p>
	</UserStyled>
);

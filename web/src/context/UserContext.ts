import { IUserProfile } from '../models/UserProfile';
import React from 'react';

export const UserContext = React.createContext<IUserProfile>({
	registered: false,
	type: 1,
	email: 'na',
	authenticated: false,
	avatar: ''
});

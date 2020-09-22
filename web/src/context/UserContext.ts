import { IUserProfile } from '../models/UserProfile';
import React from 'react';

export const UserContext = React.createContext<IUserProfile | null>(null);

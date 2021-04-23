import React from 'react';
import { FileSystemService } from '../services/FileSystemService';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const FileSystemContext = React.createContext<FileSystemService>(null);

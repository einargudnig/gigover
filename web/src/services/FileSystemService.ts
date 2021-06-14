import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { FileUploadType } from '../models/FileUploadType';
import { devError, devInfo } from '../utils/ConsoleUtils';
import { Project } from '../models/Project';
import { FileType } from '../models/ProjectFile';
import axios from 'axios';
import { ApiService } from './ApiService';
import { ProjectImage } from '../models/ProjectImage';
import { DocumentInput } from '../mutations/useAddDocument';

interface UploadResult {
	downloadUrl: string;
}

export interface FileDocument {
	created: number;
	downloadUrl: string;
	fileName: string;
	filePath: string;
	fileType: FileType;
	size: number;
	type: FileUploadType;
	fileId: string;
	projectId: number;
	externalId?: number;
}

export interface FolderResult {
	folders: string[];
	files: FileDocument[];
}

export class FileSystemService {
	private dbRef: firebase.database.Reference;
	private fileSystem: firebase.storage.Storage;
	private ref: firebase.storage.Reference;

	constructor() {
		this.fileSystem = firebase.app().storage('gs://gigover-fileystem');
		this.ref = this.fileSystem.ref();
		this.dbRef = firebase.database().ref();
	}

	assertProjectAccess(projects: Project[], projectId: number) {
		const foundProject = projects.find((p) => p.projectId === projectId);

		if (!foundProject) {
			throw new Error('Unauthorized access to project');
		}
	}

	getProjectChild(projectId: number) {
		return this.ref.child(`${projectId}`);
	}

	getDbProjectChild(projectId: number) {
		return this.dbRef.child(`${projectId}`);
	}

	getProjectFilesQuery(projectId: number, limit?: number) {
		const query = this.getDbProjectChild(projectId).orderByChild('created');

		if (limit) {
			query.limitToFirst(limit);
		}

		return query;
	}

	getProjectFilesDb(
		projectId: number,
		callback: (snapshot: firebase.database.DataSnapshot) => void,
		limit?: number
	) {
		return this.getProjectFilesQuery(projectId, limit).on('value', callback);
	}

	async getProjectFile(projectId: number, fileId: string) {
		try {
			const res = await this.getDbProjectChild(projectId).child(fileId).once('value');
			return res.val() as FileDocument;
		} catch (e) {
			devError(e);
			throw new Error('Could not find file');
		}
	}

	async updateDoc(
		file: File,
		projectId: number,
		fileId: string,
		fileName: string,
		filePath: string,
		downloadUrl: string,
		uploadType: FileUploadType,
		bytes: number,
		externalId: number | null
	) {
		const fileType: FileType = this.getFileTypeForFile(file);

		return this.getDbProjectChild(projectId).child(fileId).set({
			type: uploadType,
			fileId: fileId,
			projectId: projectId,
			fileName,
			filePath,
			externalId,
			downloadUrl,
			fileType: fileType,
			size: bytes,
			created: new Date().getTime()
		});
	}

	async uploadFile(
		file: File,
		projectId: number,
		folderId: number,
		uploadType = FileUploadType.Project,
		status: (progress: number, state: firebase.storage.TaskState) => void,
		externalId?: number
	): Promise<DocumentInput> {
		devInfo('Gigover File Upload initiated');

		const fileName = uuid();
		const originalFileName = file.name;
		const extension = originalFileName.split('.').pop();
		const filePath =
			fileName + (extension && extension !== originalFileName ? '.' + extension : '');

		return new Promise<DocumentInput>((resolve, reject) => {
			const uploadTask = this.getProjectChild(projectId).child(filePath).put(file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					status(progress, snapshot.state);
				},
				(error) => {
					devError('File upload error', error);
					reject(error.message);
				},
				async () => {
					const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

					await this.updateDoc(
						file,
						projectId,
						fileName,
						originalFileName,
						filePath,
						downloadURL,
						uploadType,
						file.size,
						externalId || null
					);

					const image: DocumentInput = {
						projectId,
						folderId,
						name: fileName,
						type: 0,
						url: downloadURL,
						bytes: file.size
					};

					devInfo('File uploaded');
					resolve(image);
				}
			);
		});
	}

	private getFileTypeForFile(file: File): FileType {
		if (file.type.startsWith('text/')) {
			return 'txt';
		}

		if (file.type.startsWith('video/')) {
			return 'video';
		}

		if (file.type.startsWith('image/')) {
			return 'picture';
		}

		switch (file.type) {
			case 'application/msword':
				return 'document';
			case 'application/pdf':
				return 'pdf';
			default:
				return 'other';
		}
	}
}

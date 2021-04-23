import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { FileUploadType } from '../models/FileUploadType';
import { devError } from '../utils/ConsoleUtils';
import { Project } from '../models/Project';

interface UploadResult {
	downloadUrl: string;
}

export interface FileDocument {
	created: number;
	downloadUrl: string;
	fileExtension: string;
	path: string;
	type: FileUploadType;
}

export interface FolderResult {
	folders: string[];
	files: FileDocument[];
}

export interface FolderResultDb {
	files: string[];
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

	listAllFiles(ref: firebase.storage.Reference) {
		return ref.listAll();
	}

	getDbProjectChild(projectId: number) {
		return this.dbRef.child(`${projectId}`);
	}

	getProjectFilesDb(
		projectId: number,
		callback: (snapshot: firebase.database.DataSnapshot) => void
	) {
		return this.getDbProjectChild(projectId).on('value', callback);
	}

	async getProjectFiles(projectId: number): Promise<FolderResult> {
		try {
			const folders: string[] = [];
			const res = await this.listAllFiles(this.getProjectChild(projectId));

			res.prefixes.forEach((folderRef) => {
				// eslint-disable-next-line no-console
				console.log('folderRef', folderRef);
				folders.push(folderRef.name);
			});

			// res.items.forEach((itemRef) => {
			// 	// eslint-disable-next-line no-console
			// 	console.log('itemRef', itemRef);
			// 	files.push(itemRef.name);
			// });

			return {
				folders,
				files: []
			};
		} catch (e) {
			devError('GetProjectFiles', e);
			return {
				folders: [],
				files: []
			};
		}
	}

	async updateDoc(
		projectId: number,
		fileName: string,
		filePath: string,
		fileExtension: string,
		downloadUrl: string,
		uploadType: FileUploadType,
		externalId: number | null
	) {
		return this.getDbProjectChild(projectId).child(fileName).set({
			type: uploadType,
			path: filePath,
			fileExtension: fileExtension,
			externalId: externalId,
			downloadUrl: downloadUrl,
			created: new Date().getTime()
		});
	}

	async uploadFile(
		file: File,
		projectId: number,
		uploadType = FileUploadType.Project,
		fileExtension: string,
		status: (progress: number, state: firebase.storage.TaskState) => void,
		externalId?: number
	): Promise<UploadResult> {
		// eslint-disable-next-line no-console
		console.log('Gigover File Upload initiated');

		const fileName = uuid();
		const filePath = `${uploadType}${
			externalId ? `${externalId}/${fileName}` : fileName
		}${fileExtension}`;

		return new Promise<UploadResult>((resolve, reject) => {
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
						projectId,
						fileName,
						filePath,
						fileExtension,
						downloadURL,
						uploadType,
						externalId || null
					);

					resolve({ downloadUrl: downloadURL });
				}
			);
		});
	}
}
